package iuh.fit.orderservice.service;

import iuh.fit.orderservice.dto.request.CreateOrderRequest;
import iuh.fit.orderservice.dto.request.UpdateDeliveryStatus;
import iuh.fit.orderservice.dto.response.OrderResponse;
import iuh.fit.orderservice.mapper.OrderMapper;
import iuh.fit.orderservice.model.Order;
import iuh.fit.orderservice.repository.OrderRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final RestTemplate restTemplate;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderMapper orderMapper, RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.restTemplate = restTemplate;
    }

    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setPromotionId(request.getPromotionId());
        order.setCreatedDate(LocalDate.now());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus("PENDING");
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryStatus(request.getDeliveryStatus());
        order.setDeliveryDate(request.getDeliveryDate());

        System.out.println("BEFORE SAVE: " + order.toString());
        Order savedOrder = orderRepository.save(order);
        System.out.println("AFTER SAVE: Order saved with ID: " + savedOrder.getOrderId());

        // Gọi payment-service
        try {
            String paymentUrl = "http://api-gateway:8080/api/payments";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            PaymentRequest paymentRequest = new PaymentRequest(
                    savedOrder.getOrderId(),
                    request.getPaymentMethodId(),
                    savedOrder.getTotalAmount()
            );
            HttpEntity<PaymentRequest> entity = new HttpEntity<>(paymentRequest, headers);

            System.out.println("CALLING PAYMENT SERVICE at: " + paymentUrl);
            System.out.println("PAYMENT REQUEST BODY: " + paymentRequest.toString());

            ResponseEntity<String> response = restTemplate.exchange(
                    paymentUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            System.out.println("PAYMENT SERVICE RESPONSE STATUS: " + response.getStatusCode());

            if (response.getStatusCode().is2xxSuccessful()) {
                savedOrder.setStatus("PAYMENT_SUCCESS");
                System.out.println("PAYMENT SERVICE RESPONSE BODY: " + response.getBody());
            } else {
                savedOrder.setStatus("PAYMENT_FAILED");
                System.err.println("PAYMENT SERVICE RESPONSE BODY (ERROR): " + response.getBody());
                orderRepository.save(savedOrder);
                throw new RuntimeException("Payment failed with status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            savedOrder.setStatus("PAYMENT_FAILED");
            orderRepository.save(savedOrder);
            System.err.println("ERROR CALLING PAYMENT SERVICE: " + e.getMessage());
            throw new RuntimeException("Payment error: " + e.getMessage());
        }

        orderRepository.save(savedOrder);
        return orderMapper.toOrderResponse(savedOrder);
    }
    public OrderResponse updateDeliveryStatus(String orderId, UpdateDeliveryStatus request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setDeliveryStatus(request.getDeliveryStatus());
        order.setDeliveryDate(request.getDeliveryDate());

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toOrderResponse(updatedOrder);
    }
    @Data
    private static class PaymentRequest {
        private final String orderId;
        private final String paymentMethodId;
        private final double amount;
    }
}