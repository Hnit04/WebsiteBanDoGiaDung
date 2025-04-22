package iuh.fit.paymentservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "payments")
@Data
public class Payment {
    @Id
    private String paymentId;
    private String orderId;
    private String paymentMethodId;
    private double amount;
    private LocalDate paymentDate;
    private PaymentStatus status;
}