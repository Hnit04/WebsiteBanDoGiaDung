package iuh.fit.notificationservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
public class Notification {
    @Id
    private String notificationId;
    private String userId;
    private String message;
    private String type;
    private LocalDateTime createdDate;
    private boolean isRead;
}