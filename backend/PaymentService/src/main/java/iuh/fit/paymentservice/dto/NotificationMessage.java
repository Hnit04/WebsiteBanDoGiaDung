package iuh.fit.paymentservice.dto;

import lombok.Data;

@Data
public class NotificationMessage {
    private String userId;
    private String message;
    private String type;
}