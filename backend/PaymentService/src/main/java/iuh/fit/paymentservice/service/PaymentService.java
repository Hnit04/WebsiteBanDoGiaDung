package iuh.fit.paymentservice.service;

import iuh.fit.paymentservice.config.RabbitMQConfig;
import iuh.fit.paymentservice.dto.NotificationMessage;
import iuh.fit.paymentservice.dto.request.CreatePaymentRequest;
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
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, PaymentMapper paymentMapper, RestTemplate restTemplate, RabbitTemplate rabbitTemplate) {
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.restTemplate = restTemplate;
        this.rabbitTemplate = rabbitTemplate;
    }

    public PaymentResponse createPayment(CreatePaymentRequest request) {
        logger.info("Bắt đầu tạo thanh toán cho đơn hàng: {}", request.getOrderId());
        try {
            String orderUrl = "http://api-gateway:8080/api/orders/" + request.getOrderId();
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

        // Tạo payment mới
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setPaymentMethodId(request.getPaymentMethodId());
        payment.setAmount(request.getAmount());
        payment.setPaymentDate(LocalDate.now());
        payment.setStatus(PaymentStatus.COMPLETED);

        // Lưu payment vào MongoDB
        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Lưu thanh toán thành công vào MongoDB: {}", savedPayment.getPaymentId());

        // Gửi thông điệp đến RabbitMQ
        String userId = getUserIdFromOrder(request.getOrderId());
        logger.info("Lấy userId: {} từ đơn hàng: {}", userId, request.getOrderId());

        // Thay đổi phần gửi message thành như sau:
        if (userId != null) {
            try {
                NotificationMessage message = new NotificationMessage();
                message.setUserId(userId);
                message.setMessage("Thanh toán cho đơn hàng #" + request.getOrderId()
                        + " đã hoàn tất với số tiền " + request.getAmount() + " VND.");
                message.setType("PAYMENT_CONFIRMATION");

                logger.info("Gửi thông điệp thanh toán đến RabbitMQ: {}", message);

                // Thêm convertAndSend với MessagePostProcessor để đảm bảo delivery
                rabbitTemplate.convertAndSend(RabbitMQConfig.NOTIFICATION_QUEUE, message, m -> {
                    m.getMessageProperties().setDeliveryMode(MessageDeliveryMode.PERSISTENT);
                    return m;
                });

                logger.info("Đã gửi thông điệp thanh toán đến RabbitMQ.");
            } catch (Exception e) {
                logger.error("Lỗi khi gửi thông báo: {}", e.getMessage());
                // Không throw exception để không ảnh hưởng đến flow chính
            }
        }

        logger.info("Tạo thanh toán thành công cho đơn hàng: {}", savedPayment.getOrderId());
        return paymentMapper.toPaymentResponse(savedPayment);
    }

    private String getUserIdFromOrder(String orderId) {
        logger.info("Bắt đầu lấy userId cho đơn hàng: {}", orderId);
        try {
            String orderUrl = "http://api-gateway:8080/api/orders/" + orderId;
            logger.info("Gọi Order Service tại: {}", orderUrl);
            OrderResponse order = restTemplate.getForObject(orderUrl, OrderResponse.class);
            logger.info("Phản hồi từ Order Service (lấy userId): {}", order);
            return order != null ? order.getUserId() : null;
        } catch (Exception e) {
            logger.error("Lỗi khi lấy userId từ OrderService: {}", e.getMessage());
            return null; // Trả về null thay vì throw exception để không làm gián đoạn quá trình tạo thanh toán
        }
    }
}