package iuh.fit.paymentservice.service;

import iuh.fit.paymentservice.model.Payment;
import iuh.fit.paymentservice.model.PaymentStatus;
import iuh.fit.paymentservice.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class PaymentTimeoutTask {

    private final PaymentRepository paymentRepository;
    private final int transactionTimeout;

    public PaymentTimeoutTask(PaymentRepository paymentRepository, @Value("${sepay.transaction-timeout}") int transactionTimeout) {
        this.paymentRepository = paymentRepository;
        this.transactionTimeout = transactionTimeout;
    }

    @Scheduled(fixedRate = 60000) // Chạy mỗi phút
    public void checkExpiredPayments() {
        paymentRepository.findAll().stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PENDING)
                .filter(payment -> ChronoUnit.SECONDS.between(payment.getPaymentDate().atStartOfDay(), LocalDate.now().atStartOfDay()) > transactionTimeout)
                .forEach(payment -> {
                    payment.setStatus(PaymentStatus.EXPIRED);
                    paymentRepository.save(payment);
                });
    }
}