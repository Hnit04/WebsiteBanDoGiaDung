package iuh.fit.orderservice.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class OrderResponse {
    private String orderId;
    private String userId;
    private String promotionId;
    private LocalDate createdDate;
    private double totalAmount;
    private String status;
    private String deliveryAddress;
    private String deliveryStatus;
    private LocalDate deliveryDate;
    private List<OrderDetailResponse> orderDetails;
}