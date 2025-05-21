package iuh.fit.paymentservice.dto.request;

import lombok.Data;

@Data
public class CreateSepayPaymentRequest {
    private String orderId;
    private double amount;
    private String description;
    private String bankAccountNumber;
    private String bankCode; // e.g., MBBank
    private String customerEmail;
}