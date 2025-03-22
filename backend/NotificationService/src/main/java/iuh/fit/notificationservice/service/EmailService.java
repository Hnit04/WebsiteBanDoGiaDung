package iuh.fit.notificationservice.service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import iuh.fit.notificationservice.model.NotificationRequest;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail; // Lấy email từ cấu hình

    public void sendEmail(NotificationRequest request) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);  // Bắt buộc phải có
        helper.setTo(request.getEmail());
        helper.setSubject(request.getSubject());
        helper.setText(request.getMessage(), true);

        mailSender.send(message);
    }
}
