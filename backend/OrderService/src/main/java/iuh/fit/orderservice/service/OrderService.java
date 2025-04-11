package iuh.fit.orderservice.service;

import iuh.fit.orderservice.dto.OrderRequest;
import iuh.fit.orderservice.dto.OrderResponse;
import iuh.fit.orderservice.model.Order;
import iuh.fit.orderservice.model.OrderStatus;
import iuh.fit.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    public String placeOrder(OrderRequest orderRequest) {
        Order order = Order.builder()
                .id(UUID.randomUUID().toString())
                .userId(orderRequest.getUserId())
                .orderItems(orderRequest.getOrderItems())
                .totalPrice(orderRequest.getTotalPrice())
                .createdAt(Instant.now())
                .status(OrderStatus.PENDING) // Đơn hàng mặc định ở trạng thái "PENDING"
                .build();

        orderRepository.save(order);
        return "Order placed successfully!";
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .orderItems(order.getOrderItems())
                .totalPrice(order.getTotalPrice())
                .createdAt(order.getCreatedAt())
                .status(order.getStatus())
                .build();
    }
}
