package iuh.fit.notificationservice.dto.request;

import lombok.Data;

@Data
public class CreateNotificationRequest {
    private String userId;
    private String message;
    private String type;
}