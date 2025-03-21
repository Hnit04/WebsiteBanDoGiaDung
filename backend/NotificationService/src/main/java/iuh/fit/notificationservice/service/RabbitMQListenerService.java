package iuh.fit.notificationservice.service;



import iuh.fit.notificationservice.config.RabbitMQConfig;
import iuh.fit.notificationservice.model.NotificationRequest;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RabbitMQListenerService {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void receiveNotification(NotificationRequest request) {
        try {
            emailService.sendEmail(request);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
