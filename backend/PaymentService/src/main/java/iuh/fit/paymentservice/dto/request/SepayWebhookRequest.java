package iuh.fit.paymentservice.dto.request;

import lombok.Data;



@Data
public class SepayWebhookRequest {
    private String gateway; // ví dụ: "MBBank"
    private String transactionDate; // ví dụ: "2025-05-10 15:57:00"
    private String accountNumber; // ví dụ: "0326829327"
    private String subAccount; // ví dụ: null
    private String code; // ví dụ: null
    private String content; // ví dụ: "THT1746867435701"
    private String transferType; // ví dụ: "in"
    private String description; // ví dụ: "BankAPINotify THT1746867435701"
    private double transferAmount; // ví dụ: 2000
    private String referenceCode; // ví dụ: "FT25130745566575"
    private int accumulated; // ví dụ: 0
    private long id; // ví dụ: 12582536
}