package iuh.fit.paymentservice.dto.response;

import lombok.Data;

@Data
public class WebhookResponse {
    private boolean success;
    private String message;

    public WebhookResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}