package iuh.fit.notificationservice.controller;
import iuh.fit.notificationservice.service.EmailService;
import iuh.fit.notificationservice.model.NotificationRequest;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @PostMapping("/send")
    public String sendNotification(@RequestBody NotificationRequest request) {
        try {
            emailService.sendEmail(request);
            return "Email sent successfully!";
        } catch (MessagingException e) {
            return "Failed to send email: " + e.getMessage();
        }
    }
}
