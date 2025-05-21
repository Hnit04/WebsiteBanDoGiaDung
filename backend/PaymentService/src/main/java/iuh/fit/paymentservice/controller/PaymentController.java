package iuh.fit.paymentservice.controller;

import iuh.fit.paymentservice.dto.request.CreatePaymentRequest;
import iuh.fit.paymentservice.dto.request.CreateSepayPaymentRequest;
import iuh.fit.paymentservice.dto.request.SepayWebhookRequest;
import iuh.fit.paymentservice.dto.response.PaymentResponse;
import iuh.fit.paymentservice.dto.response.WebhookResponse;
import iuh.fit.paymentservice.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody CreatePaymentRequest request) {
        PaymentResponse payment = paymentService.createPayment(request);
        return ResponseEntity.status(201).body(payment);
    }

    @PostMapping("/sepay")
    public ResponseEntity<PaymentResponse> createSepayPayment(@RequestBody CreateSepayPaymentRequest request) {
        PaymentResponse payment = paymentService.createSepayPayment(request);
        return ResponseEntity.status(201).body(payment);
    }

    @PostMapping("/sepay/webhook")
    public ResponseEntity<WebhookResponse> handleWebhook(@RequestBody SepayWebhookRequest request) {
        try {
            String paymentId = extractPaymentId(request.getContent(), request.getDescription());
            String status = request.getTransferType().equals("in") ? "SUCCESS" : "PENDING";
            PaymentResponse updatedPayment = paymentService.updatePaymentStatus(paymentId, status, request.getTransferAmount());
            return ResponseEntity.ok().body(new WebhookResponse(true, "Webhook nhận và xử lý thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new WebhookResponse(false, "Lỗi xử lý webhook: " + e.getMessage()));
        }
    }

    private String extractPaymentId(String content, String description) {
        String regex = "THT\\d+";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(regex);

        // Kiểm tra trường content
        if (content != null) {
            java.util.regex.Matcher matcher = pattern.matcher(content);
            if (matcher.find()) {
                return matcher.group();
            }
        }

        // Kiểm tra trường description
        if (description != null) {
            java.util.regex.Matcher matcher = pattern.matcher(description);
            if (matcher.find()) {
                return matcher.group();
            }
        }

        throw new RuntimeException("Không tìm thấy paymentId trong webhook");
    }
}