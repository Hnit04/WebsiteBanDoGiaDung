// PaymentTimeoutTask.java
package iuh.fit.paymentservice.service;

import iuh.fit.paymentservice.dto.TransactionUpdate;
import iuh.fit.paymentservice.model.Payment;
import iuh.fit.paymentservice.model.PaymentStatus;
import iuh.fit.paymentservice.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
public class PaymentTimeoutTask {

    private static final Logger logger = LoggerFactory.getLogger(PaymentTimeoutTask.class);

    private final PaymentRepository paymentRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final int transactionTimeout;

    public PaymentTimeoutTask(PaymentRepository paymentRepository, SimpMessagingTemplate messagingTemplate,
                              @Value("${sepay.transaction-timeout}") int transactionTimeout) {
        this.paymentRepository = paymentRepository;
        this.messagingTemplate = messagingTemplate;
        this.transactionTimeout = transactionTimeout;
    }

    @Scheduled(fixedRate = 60000)
    public void checkExpiredPayments() {
        logger.info("Kiểm tra các giao dịch hết hạn...");
        paymentRepository.findAll().stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PENDING)
                .filter(payment -> {
                    LocalDateTime paymentDateTime = payment.getPaymentDate().atStartOfDay();
                    long secondsElapsed = ChronoUnit.SECONDS.between(paymentDateTime, LocalDateTime.now());
                    return secondsElapsed > transactionTimeout;
                })
                .forEach(payment -> {
                    logger.info("Giao dịch {} đã hết hạn", payment.getPaymentId());
                    payment.setStatus(PaymentStatus.EXPIRED);
                    paymentRepository.save(payment);
                    messagingTemplate.convertAndSend("/topic/transactions",
                            new TransactionUpdate(payment.getPaymentId(), "EXPIRED", payment.getQrCodeUrl()));
                });
    }
}