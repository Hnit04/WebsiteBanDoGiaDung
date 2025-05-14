package iuh.fit.orderservice.dto.request;

import lombok.Data;

@Data
public class UpdateOrderDetailRequest {
    private String orderDetailId;
    private Integer quantity; // Có thể null nếu không thay đổi
    private Double unitPrice; // Có thể null nếu không thay đổi
}