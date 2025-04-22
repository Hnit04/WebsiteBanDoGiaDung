package iuh.fit.orderservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "orders")
@Data
public class Order {
    @Id
    private String orderId;
    private String userId;
    private String promotionId;
    private LocalDate createdDate;
    private double totalAmount;
    private String status;
    private String deliveryAddress;
    private String deliveryStatus;
    private LocalDate deliveryDate;
    private List<OrderDetail> orderDetails;
}