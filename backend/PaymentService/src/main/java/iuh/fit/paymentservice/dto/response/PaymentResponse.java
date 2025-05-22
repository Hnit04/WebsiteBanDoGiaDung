package iuh.fit.paymentservice.dto.response;

import iuh.fit.paymentservice.model.PaymentStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private String paymentId;
    private String orderId;
    private String paymentMethodId;
    private double amount;
    private LocalDateTime paymentDate;
    private PaymentStatus status;
    private String qrCodeUrl; // Thêm trường qrCodeUrl
}