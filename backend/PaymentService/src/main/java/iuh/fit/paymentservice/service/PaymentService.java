package iuh.fit.paymentservice.service;

import iuh.fit.paymentservice.config.RabbitMQConfig;
import iuh.fit.paymentservice.dto.NotificationMessage;
import iuh.fit.paymentservice.dto.TransactionUpdate;
import iuh.fit.paymentservice.dto.request.CreatePaymentRequest;
import iuh.fit.paymentservice.dto.request.CreateSepayPaymentRequest;
import iuh.fit.paymentservice.dto.response.OrderResponse;
import iuh.fit.paymentservice.dto.response.PaymentResponse;
import iuh.fit.paymentservice.mapper.PaymentMapper;
import iuh.fit.paymentservice.model.Payment;
import iuh.fit.paymentservice.model.PaymentStatus;
import iuh.fit.paymentservice.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.MessageDeliveryMode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final SimpMessagingTemplate messagingTemplate; // WebSocket template

    @Value("${sepay.qr-url}")
    private String sepayQrUrl;

    @Value("${sepay.transaction-timeout}")
    private int transactionTimeout;

    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper,
                          RestTemplate restTemplate, RabbitTemplate rabbitTemplate,
                          SimpMessagingTemplate messagingTemplate) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.restTemplate = restTemplate;
        this.rabbitTemplate = rabbitTemplate;
        this.messagingTemplate = messagingTemplate;
    }

    public PaymentResponse createPayment(CreatePaymentRequest request) {
        logger.info("Bắt đầu tạo thanh toán cho đơn hàng: {}", request.getOrderId());
        try {
            String orderUrl = "https://websitebandogiadung.onrender.com/api/orders/" + request.getOrderId();
            logger.info("Gọi Order Service tại: {}", orderUrl);
            OrderResponse order = restTemplate.getForObject(orderUrl, OrderResponse.class);
            if (order == null || order.getTotalAmount() != request.getAmount()) {
                logger.error("Đơn hàng không hợp lệ hoặc số tiền không khớp. Order: {}, Request Amount: {}", order, request.getAmount());
                throw new RuntimeException("Invalid order or amount");
            }
            logger.info("Thông tin đơn hàng hợp lệ: {}", order);
        } catch (Exception e) {
            logger.error("Lỗi khi xác thực đơn hàng: {}", e.getMessage());
            throw new RuntimeException("Error validating order: " + e.getMessage());
        }

        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setPaymentMethodId(request.getPaymentMethodId());
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(PaymentStatus.COMPLETED);

        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Lưu thanh toán thành công: {}", savedPayment.getPaymentId());

        sendNotification(savedPayment.getOrderId(), getUserIdFromOrder(savedPayment.getOrderId()));
        return paymentMapper.toPaymentResponse(savedPayment);
    }

    public PaymentResponse createSepayPayment(CreateSepayPaymentRequest request) {
        logger.info("Bắt đầu tạo giao dịch SEPay cho đơn hàng: {}", request.getOrderId());

        // Xác thực đơn hàng
        try {
            String orderUrl = "https://websitebandogiadung.onrender.com/api/orders/" + request.getOrderId();
            OrderResponse order = restTemplate.getForObject(orderUrl, OrderResponse.class);
            if (order == null || order.getTotalAmount() != request.getAmount()) {
                logger.error("Đơn hàng không hợp lệ hoặc số tiền không khớp.");
                throw new RuntimeException("Invalid order or amount");
            }
        } catch (Exception e) {
            logger.error("Lỗi khi xác thực đơn hàng: {}", e.getMessage());
            throw new RuntimeException("Error validating order: " + e.getMessage());
        }

        // Tạo giao dịch SEPay
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setPaymentMethodId("sepay-qr");
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(PaymentStatus.PENDING);

        // Tạo URL mã QR
        String qrCodeUrl = String.format("%s?acc=%s&bank=%s&amount=%s&des=%s",
                sepayQrUrl, request.getBankAccountNumber(), request.getBankCode(),
                request.getAmount(), request.getOrderId());
        payment.setQrCodeUrl(qrCodeUrl);

        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Lưu giao dịch SEPay thành công: {}", savedPayment.getPaymentId());

        // Gửi thông báo WebSocket
        messagingTemplate.convertAndSend("/topic/transactions",
                new TransactionUpdate(savedPayment.getPaymentId(), "CREATED", qrCodeUrl));

        return paymentMapper.toPaymentResponse(savedPayment);
    }

    public PaymentResponse updatePaymentStatus(String paymentId, String status, double amount) {
        logger.info("Cập nhật trạng thái giao dịch {} thành {}", paymentId, status);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch: " + paymentId));

        payment.setStatus(PaymentStatus.valueOf(status));
        payment.setAmount(amount);
        Payment updatedPayment = paymentRepository.save(payment);

        // Gửi thông báo WebSocket
        messagingTemplate.convertAndSend("/topic/transactions",
                new TransactionUpdate(paymentId, status, payment.getQrCodeUrl()));

        if (status.equals("SUCCESS")) {
            sendNotification(payment.getOrderId(), getUserIdFromOrder(payment.getOrderId()));
        }

        return paymentMapper.toPaymentResponse(updatedPayment);
    }

    private void sendNotification(String orderId, String userId) {
        if (userId != null) {
            try {
                NotificationMessage message = new NotificationMessage();
                message.setUserId(userId);
                message.setMessage("Thanh toán cho đơn hàng #" + orderId + " đã hoàn tất.");
                message.setType("PAYMENT_CONFIRMATION");

                rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_QUEUE, message, m -> {
                    m.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                    return m;
                });
                logger.info("Đã gửi thông báo thanh toán đến RabbitMQ.");
            } catch (Exception e) {
                logger.error("Lỗi khi gửi thông báo: {}", e.getMessage());
            }
        }
    }

    private String getUserIdFromOrder(String orderId) {
        try {
            String orderUrl = "https://websitebandogiadung.onrender.com/api/orders/" + orderId;
            OrderResponse order = restTemplate.getForObject(orderUrl, OrderResponse.class);
            return order != null ? order.getUserId() : null;
        } catch (Exception e) {
            logger.error("Lỗi khi lấy userId: {}", e.getMessage());
            return null;
        }
    }
}