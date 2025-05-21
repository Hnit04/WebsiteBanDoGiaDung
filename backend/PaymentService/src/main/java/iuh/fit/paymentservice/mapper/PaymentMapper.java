package iuh.fit.paymentservice.mapper;

import iuh.fit.paymentservice.dto.response.PaymentResponse;
import iuh.fit.paymentservice.model.Payment;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {
    public PaymentResponse toPaymentResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(payment.getPaymentId());
        response.setOrderId(payment.getOrderId());
        response.setPaymentMethodId(payment.getPaymentMethodId());
        response.setAmount(payment.getAmount());
        response.setPaymentDate(payment.getPaymentDate());
        response.setStatus(payment.getStatus());
        response.setQrCodeUrl(payment.getQrCodeUrl()); // Thêm qrCodeUrl
        return response;
    }
}