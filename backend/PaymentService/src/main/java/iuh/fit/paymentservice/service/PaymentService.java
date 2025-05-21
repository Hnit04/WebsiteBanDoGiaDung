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
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime; // Thay đổi từ LocalDate

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${sepay.qr-url}")
    private String sepayQrUrl;

    @Value("${sepay.transaction-timeout}")
    private int transactionTimeout;

    @Value("${order.service.url}")
    private String orderServiceUrl;

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
        validateOrder(request.getOrderId(), request.getAmount());

        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setPaymentMethodId(request.getPaymentMethodId());
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDateTime.now()); // Thay đổi từ LocalDate.now()
        payment.setStatus(PaymentStatus.COMPLETED);

        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Lưu thanh toán thành công: {}", savedPayment.getPaymentId());

        sendNotification(savedPayment.getOrderId(), getUserIdFromOrder(savedPayment.getOrderId()));
        return paymentMapper.toPaymentResponse(savedPayment);
    }

    public PaymentResponse createSepayPayment(CreateSepayPaymentRequest request) {
        logger.info("Bắt đầu tạo giao dịch SEPay cho đơn hàng: {}", request.getOrderId());
        validateOrder(request.getOrderId(), request.getAmount());

        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setPaymentMethodId("sepay-qr");
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDateTime.now()); // Thay đổi từ LocalDate.now()
        payment.setStatus(PaymentStatus.PENDING);

        String qrCodeUrl = String.format("%s?acc=%s&bank=%s&amount=%s&des=%s",
                sepayQrUrl, request.getBankAccountNumber(), request.getBankCode(),
                request.getAmount(), request.getOrderId());
        payment.setQrCodeUrl(qrCodeUrl);

        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Lưu giao dịch SEPay thành công: {}", savedPayment.getPaymentId());

        messagingTemplate.convertAndSend("/topic/transactions",
                new TransactionUpdate(savedPayment.getPaymentId(), "CREATED", qrCodeUrl));

        return paymentMapper.toPaymentResponse(savedPayment);
    }

    public PaymentResponse updatePaymentStatus(String paymentId, String status, double amount) {
        logger.info("Cập nhật trạng thái giao dịch {} thành {}", paymentId, status);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giao dịch: " + paymentId));
        try {
            payment.setStatus(PaymentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            logger.error("Trạng thái không hợp lệ: {}", status);
            throw new RuntimeException("Invalid status: " + status);
        }
        payment.setAmount(amount);
        Payment updatedPayment = paymentRepository.save(payment);

        messagingTemplate.convertAndSend("/topic/transactions",
                new TransactionUpdate(paymentId, status, payment.getQrCodeUrl()));

        if (status.equals("SUCCESS")) {
            sendNotification(payment.getOrderId(), getUserIdFromOrder(payment.getOrderId()));
        }

        return paymentMapper.toPaymentResponse(updatedPayment);
    }

    @Retryable(value = {Exception.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    private void validateOrder(String orderId, double amount) {
        String orderUrl = orderServiceUrl + "/" + orderId;
        logger.info("Kiểm tra đơn hàng: orderId={}, amount={}", orderId, amount);
        OrderResponse order = restTemplate.getForObject(orderUrl, OrderResponse.class);
        if (order == null) {
            logger.error("Đơn hàng không tồn tại: {}", orderId);
            throw new RuntimeException("Invalid order");
        }
        if (order.getTotalAmount() != amount) {
            logger.error("Số tiền không khớp. Order Amount: {}, Provided Amount: {}", order.getTotalAmount(), amount);
            throw new RuntimeException("Invalid amount");
        }
        logger.info("Thông tin đơn hàng hợp lệ: {}", order);
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
            String orderUrl = orderServiceUrl + "/" + orderId;
            OrderResponse order = restTemplate.getForObject(orderUrl, OrderResponse.class);
            return order != null ? order.getUserId() : null;
        } catch (Exception e) {
            logger.error("Lỗi khi lấy userId: {}", e.getMessage());
            return null;
        }
    }
}