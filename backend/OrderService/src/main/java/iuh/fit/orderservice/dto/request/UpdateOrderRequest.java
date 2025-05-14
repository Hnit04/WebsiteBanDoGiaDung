package iuh.fit.orderservice.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Data
public class UpdateOrderRequest {
    @NotBlank
    private String userId;
    private String promotionId;
    @Positive
    private double totalAmount;
    @NotBlank
    private String deliveryAddress;
    private String deliveryStatus;
    private LocalDate deliveryDate;
}