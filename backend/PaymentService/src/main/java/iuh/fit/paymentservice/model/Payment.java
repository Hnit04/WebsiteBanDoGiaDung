package iuh.fit.paymentservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime; // Thay đổi từ LocalDate
import java.util.ArrayList;
import java.util.List;

@Document(collection = "payments")
@Data
public class Payment {
    @Id
    private String paymentId;
    private String orderId;
    private String paymentMethodId;
    private double amount;
    private LocalDateTime paymentDate; // Thay đổi kiểu dữ liệu
    private PaymentStatus status;
    private String qrCodeUrl;
    private List<String> errorLogs = new ArrayList<>();
}