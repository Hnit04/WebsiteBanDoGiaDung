package iuh.fit.notificationservice.dto;

import lombok.Data;

@Data
public class NotificationMessage {
    private String userId;
    private String email; // Thêm field email
    private String message;
    private String type;


}