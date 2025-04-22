package iuh.fit.orderservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "order_details")
@Data
public class OrderDetail {
    @Id
    private String orderDetailId;
    private int quantity;
    private double unitPrice;
    private double subtotal;
    private String orderId;
    private String productId;
}