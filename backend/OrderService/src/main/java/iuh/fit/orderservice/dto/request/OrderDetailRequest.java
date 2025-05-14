package iuh.fit.orderservice.dto.request;

import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Data
public class OrderDetailRequest {
    @NotBlank
    private String productId;
    @Min(1)
    private int quantity;
    private double unitPrice; // Thêm để ánh xạ từ Product Service
}