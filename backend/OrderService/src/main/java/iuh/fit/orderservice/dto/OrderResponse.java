package iuh.fit.orderservice.dto;

import iuh.fit.orderservice.model.OrderItem;
import iuh.fit.orderservice.model.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private String id;
    private String userId;
    private List<OrderItem> orderItems;
    private BigDecimal totalPrice;
    private Instant createdAt;
    private OrderStatus status; // Thêm trạng thái đơn hàng
}
