package iuh.fit.orderservice.model;

import lombok.Data;

@Data
public class OrderDetail {
    private String orderDetailId; // Không cần @Id vì không phải document riêng
    private int quantity;
    private double unitPrice;
    private double subtotal;
    private String orderId;
    private String productId;
}