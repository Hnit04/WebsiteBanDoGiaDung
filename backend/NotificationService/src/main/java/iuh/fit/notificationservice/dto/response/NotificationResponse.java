package iuh.fit.notificationservice.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private String notificationId;
    private String userId;
    private String message;
    private String type;
    private LocalDateTime createdDate;
    private boolean isRead;
}