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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
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

    @Value("${notification.service.default-email:trancongtinh20042004@gmail.com}")
    private String defaultEmail;

    @Value("${notification.service.auth-token}")
    private String serviceToken; // Token từ cấu hình

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

    public List<NotificationResponse> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(notificationMapper::toNotificationResponse)
                .collect(Collectors.toList());
    }

    public NotificationResponse markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return notificationMapper.toNotificationResponse(updatedNotification);
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleNotificationMessage(String rawMessage) {
        logger.info("🐇 Received raw message: {}", rawMessage);
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            NotificationMessage message = objectMapper.readValue(rawMessage, NotificationMessage.class);

            logger.info("✅ Parsed message for user: {}", message.getUserId());

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
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("trancongtinh20042004@gmail.com", "Bán Đồ Gia Dụng");
            helper.setTo(userEmail);
            helper.setReplyTo("trancongtinh20042004@gmail.com");
            helper.setSubject("🎉 Chào mừng bạn đến với Bán Đồ Gia Dụng!");

            String htmlContent = """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Chào mừng bạn đến với Bán Đồ Gia Dụng</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px auto;">
                    <tr>
                        <td style="background-color: #2c3e50; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bán Đồ Gia Dụng</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h2 style="color: #2c3e50; font-size: 22px; margin: 0 0 20px;">Chào mừng bạn đến với chúng tôi!</h2>
                            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Bán Đồ Gia Dụng</strong>. 
                                Chúng tôi rất vui được chào đón bạn đến với cộng đồng của chúng tôi!
                            </p>
                            <p style="color: #333333; font-size: 16px; line-height: 1.5; margin: 0 0 20px;">
                                """ + message.getMessage() + """
                            </p>
                            <a href="https://your-website.com" style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px; margin: 20px 0;">Khám phá cửa hàng</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f4f4f4; padding: 20px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="color: #666666; font-size: 12px; margin: 0;">
                                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ qua 
                                <a href="mailto:trancongtinh20042004@gmail.com" style="color: #3498db; text-decoration: none;">trancongtinh20042004@gmail.com</a>.
                            </p>
                            <p style="color: #666666; font-size: 12px; margin: 10px 0 0;">
                                © 2025 Bán Đồ Gia Dụng. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """;

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            logger.info("📧 Email successfully sent to: {}", userEmail);

        } catch (Exception e) {
            logger.error("❌ Failed to send email to {}: {}", userEmail, e.getMessage());
        }
    }

    private String getUserEmail(String userId) {
        try {
            String userServiceUrl = "http://api-gateway:8080/api/users/" + userId;
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(serviceToken); // Sử dụng token từ cấu hình
            HttpEntity<?> entity = new HttpEntity<>(headers);
            ResponseEntity<UserResponse> response = restTemplate.exchange(
                    userServiceUrl, HttpMethod.GET, entity, UserResponse.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null
                    && response.getBody().getEmail() != null) {
                return response.getBody().getEmail();
            } else {
                logger.warn("No valid email found for userId: {}, status: {}",
                        userId, response.getStatusCode());
                return defaultEmail;
            }
        } catch (HttpClientErrorException e) {
            logger.error("Failed to fetch user email for userId {}: HTTP {} - {}",
                    userId, e.getStatusCode(), e.getMessage());
            return defaultEmail;
        } catch (Exception e) {
            logger.error("Unexpected error fetching user email for userId {}: {}",
                    userId, e.getMessage());
            return defaultEmail;
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