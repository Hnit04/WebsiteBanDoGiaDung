package iuh.fit.orderservice.dto.response;

import lombok.Data;

@Data
public class OrderDetailResponse {
    private String orderDetailId;
    private int quantity;
    private double unitPrice;
    private double subtotal;
    private String orderId;
    private String productId;
}