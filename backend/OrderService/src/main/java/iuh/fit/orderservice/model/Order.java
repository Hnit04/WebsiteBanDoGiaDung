package iuh.fit.orderservice.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String userId;
    private List<OrderItem> orderItems;
    private BigDecimal totalPrice;
    private Instant createdAt;
    private OrderStatus status; // Thêm trạng thái đơn hàng
}
