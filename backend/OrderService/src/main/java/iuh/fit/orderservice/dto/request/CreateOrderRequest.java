package iuh.fit.orderservice.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateOrderRequest {
    private String userId;
    private String promotionId;
    private double totalAmount;
    private String status;
    private String deliveryAddress;
    private String deliveryStatus;
    private LocalDate deliveryDate;
    private String paymentMethodId;
}