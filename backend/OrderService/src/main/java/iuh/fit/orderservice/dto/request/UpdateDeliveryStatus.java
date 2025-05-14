package iuh.fit.orderservice.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Data
public class UpdateDeliveryStatus {
    @NotBlank
    private String deliveryStatus;
    private LocalDate deliveryDate;
}