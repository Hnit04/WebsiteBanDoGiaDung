package iuh.fit.paymentservice.dto;

import lombok.Data;

@Data
public class TransactionUpdate {
    private String paymentId;
    private String status;
    private String qrCodeUrl;

    public TransactionUpdate(String paymentId, String status, String qrCodeUrl) {
        this.paymentId = paymentId;
        this.status = status;
        this.qrCodeUrl = qrCodeUrl;
    }
}