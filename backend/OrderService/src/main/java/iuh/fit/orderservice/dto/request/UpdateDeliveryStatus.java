package iuh.fit.orderservice.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateDeliveryStatus {
    private String deliveryStatus;
    private LocalDate deliveryDate;
}