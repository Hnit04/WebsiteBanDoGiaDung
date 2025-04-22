package iuh.fit.paymentservice.dto.response;

import lombok.Data;

@Data
public class OrderResponse {
    private String orderId;
    private String userId;
    private double totalAmount;
}