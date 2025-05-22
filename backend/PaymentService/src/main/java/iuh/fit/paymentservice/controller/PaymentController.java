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
            String status = request.getTransferType().equals("in") ? "COMPLETED" : "PENDING";
            PaymentResponse updatedPayment = paymentService.updatePaymentStatus(paymentId, status, request.getTransferAmount());
            return ResponseEntity.ok().body(new WebhookResponse(true, "Webhook nhận và xử lý thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new WebhookResponse(false, "Lỗi xử lý webhook: " + e.getMessage()));
        }
    }

    private String extractPaymentId(String content, String description) {
        if (content != null && !content.isEmpty()) {
            String[] parts = content.split("\\.");
            if (parts.length >= 4 && parts[3].matches("[0-9a-f]{24}")) {
                return parts[3]; // Lấy paymentId: 682e9cfb6923542153c93aaa
            }
        }
        if (description != null && !description.isEmpty()) {
            String[] parts = description.split("PaymentID: ");
            if (parts.length > 1) {
                return parts[1].trim();
            }
        }
        throw new RuntimeException("Không tìm thấy paymentId trong webhook: Định dạng content hoặc description không hợp lệ");
    }
}