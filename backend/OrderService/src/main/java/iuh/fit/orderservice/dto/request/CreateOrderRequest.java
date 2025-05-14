package iuh.fit.orderservice.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateOrderRequest {
    @NotBlank
    private String userId;
    private String promotionId;
    @Positive
    private double totalAmount;
    @NotBlank
    private String status;
    @NotBlank
    private String deliveryAddress;
    private String deliveryStatus;
    private LocalDate deliveryDate;
    @NotBlank
    private String paymentMethodId;
    private List<OrderDetailRequest> orderDetails; // Đảm bảo trường này được định nghĩa đúng
}
