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
        String[] parts = null;
        if (content != null && !content.isEmpty()) {
            parts = content.split("-");
        } else if (description != null && !description.isEmpty()) {
            parts = description.split("-");
        }

        if (parts == null || parts.length < 2) {
            throw new RuntimeException("Không tìm thấy paymentId trong webhook: Định dạng content hoặc description không hợp lệ");
        }

        String paymentId = parts[1].trim();
        if (paymentId.isEmpty()) {
            throw new RuntimeException("Không tìm thấy paymentId trong webhook: paymentId rỗng");
        }

        return paymentId;
    }
}