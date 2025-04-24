package iuh.fit.notificationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.notificationservice.config.RabbitMQConfig;
import iuh.fit.notificationservice.dto.NotificationMessage;
import iuh.fit.notificationservice.dto.request.CreateNotificationRequest;
import iuh.fit.notificationservice.dto.response.NotificationResponse;
import iuh.fit.notificationservice.mapper.NotificationMapper;
import iuh.fit.notificationservice.model.Notification;
import iuh.fit.notificationservice.repository.NotificationRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                               NotificationMapper notificationMapper,
                               JavaMailSender mailSender,
                               RestTemplate restTemplate) {
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
        this.mailSender = mailSender;
        this.restTemplate = restTemplate;
    }

    // Phương thức cho Controller
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setCreatedDate(LocalDateTime.now());
        notification.setRead(false);

        Notification savedNotification = notificationRepository.save(notification);
        logger.info("Created notification with ID: {}", savedNotification.getNotificationId());
        return notificationMapper.toNotificationResponse(savedNotification);
    }

    // Phương thức cho Controller
    public List<NotificationResponse> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(notificationMapper::toNotificationResponse)
                .collect(Collectors.toList());
    }

    // Phương thức cho Controller
    public NotificationResponse markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return notificationMapper.toNotificationResponse(updatedNotification);
    }

    // Xử lý message từ RabbitMQ
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleNotificationMessage(String rawMessage) {
        logger.info("🐇 Received raw message: {}", rawMessage);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            NotificationMessage message = objectMapper.readValue(rawMessage, NotificationMessage.class);

            logger.info("✅ Parsed message for user: {}", message.getUserId());

            // Gọi xử lý như cũ
            CreateNotificationRequest request = new CreateNotificationRequest();
            request.setUserId(message.getUserId());
            request.setMessage(message.getMessage());
            request.setType(message.getType());
            createNotification(request);
            sendEmail(message);

        } catch (Exception e) {
            logger.error("❌ Failed to parse message: {}", e.getMessage());
        }
    }


    private void sendEmail(NotificationMessage message) {
        String userEmail = getUserEmail(message.getUserId());

        logger.info("Preparing to send email to: {}", userEmail);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");

            helper.setFrom("noreply@bandogiadung.com", "Bán đồ gia dụng");
            helper.setTo(userEmail);
            helper.setReplyTo("support@bandogiadung.com");
            helper.setSubject("🎉 Chào mừng bạn đến với Bán Đồ Gia Dụng!");
            helper.setText(
                    "<p>Xin chào,</p>" +
                            "<p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Bán Đồ Gia Dụng</strong>.</p>" +
                            "<p>" + message.getMessage() + "</p>" +
                            "<hr/>" +
                            "<p style='font-size: 12px;'>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ <a href='mailto:support@bandogiadung.com'>support@bandogiadung.com</a>.</p>",
                    true
            );

            mailSender.send(mimeMessage);
            logger.info("📧 Email successfully sent to: {}", userEmail);

        } catch (Exception e) {
            logger.error("❌ Failed to send email to {}: {}", userEmail, e.getMessage());
        }
    }


    private String getUserEmail(String userId) {
        try {
            String userServiceUrl = "http://api-gateway:8080/api/users/" + userId;
            UserResponse user = restTemplate.getForObject(userServiceUrl, UserResponse.class);
            return user != null ? user.getEmail() : "default@bandogiadung.com";
        } catch (Exception e) {
            logger.error("Failed to fetch user email: {}", e.getMessage());
            return "default@bandogiadung.com";
        }
    }
}

class UserResponse {
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}