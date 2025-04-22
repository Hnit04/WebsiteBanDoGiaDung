package iuh.fit.paymentservice.dto.request;

import lombok.Data;

@Data
public class CreatePaymentRequest {
    private String orderId;
    private String paymentMethodId;
    private double amount;
}