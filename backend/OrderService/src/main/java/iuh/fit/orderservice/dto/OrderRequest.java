package iuh.fit.orderservice.dto;

import iuh.fit.orderservice.model.OrderItem;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    private String userId;
    private List<OrderItem> orderItems;
    private BigDecimal totalPrice;
}
