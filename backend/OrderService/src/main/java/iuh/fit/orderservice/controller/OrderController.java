package iuh.fit.orderservice.controller;

import iuh.fit.orderservice.dto.request.CreateOrderRequest;
import iuh.fit.orderservice.dto.request.OrderDetailRequest;
import iuh.fit.orderservice.dto.request.UpdateDeliveryStatus;
import iuh.fit.orderservice.dto.request.UpdateOrderRequest;
import iuh.fit.orderservice.dto.response.OrderResponse;
import iuh.fit.orderservice.model.Order;
import iuh.fit.orderservice.repository.OrderRepository;
import iuh.fit.orderservice.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @Autowired
    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        logger.info("Initializing OrderController");
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        logger.debug("Received POST request to /api/orders with data: {}", request);
        OrderResponse orderResponse = orderService.createOrder(request);
        logger.info("Order created successfully with response: {}", orderResponse);
        return ResponseEntity.status(201).body(orderResponse);
    }

    @PutMapping("/{orderId}/delivery-status")
    public ResponseEntity<OrderResponse> updateDeliveryStatus(
            @PathVariable String orderId,
            @Valid @RequestBody UpdateDeliveryStatus request) {
        logger.debug("Received PUT request to /api/orders/{}/delivery-status with orderId: {}", orderId, request);
        OrderResponse orderResponse = orderService.updateDeliveryStatus(orderId, request);
        logger.info("Delivery status updated for orderId {}: {}", orderId, orderResponse);
        return ResponseEntity.ok(orderResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String id) {
        logger.debug("Received GET request to /api/orders/{} for orderId: {}", id, id);
        OrderResponse orderResponse = orderService.getOrderById(id);
        logger.info("Retrieved order with id {}: {}", id, orderResponse);
        return ResponseEntity.ok(orderResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable String id,
            @Valid @RequestBody UpdateOrderRequest request) {
        logger.debug("Received PUT request to /api/orders/{} with data: {}", id, request);
        OrderResponse orderResponse = orderService.updateOrder(id, request);
        logger.info("Order updated with id {}: {}", id, orderResponse);
        return ResponseEntity.ok(orderResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        logger.debug("Received DELETE request to /api/orders/{}", id);
        orderService.deleteOrder(id);
        logger.info("Order with id {} deleted successfully", id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.debug("Received GET request to /api/orders with params: userId={}, status={}, page={}, size={}", userId, status, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderService.getOrders(userId, status, pageable);
        List<OrderResponse> responses = orders.getContent().stream()
                .map(orderService::toOrderResponse)
                .collect(Collectors.toList());
        logger.info("Retrieved {} orders for userId: {}, status: {}", responses.size(), userId, status);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{orderId}/details")
    public ResponseEntity<OrderResponse> addOrderDetail(
            @PathVariable String orderId,
            @Valid @RequestBody OrderDetailRequest request) {
        logger.debug("Received POST request to /api/orders/{}/details with orderId: {} and data: {}", orderId, orderId, request);
        OrderResponse orderResponse = orderService.addOrderDetail(orderId, request);
        logger.info("Order detail added for orderId {}: {}", orderId, orderResponse);
        return ResponseEntity.status(201).body(orderResponse);
    }
    @GetMapping("/all/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getAllOrdersByUserId(@PathVariable String userId) {
        logger.debug("Received GET request to /api/orders/all/user/{} for userId: {}", userId, userId);
        List<Order> orders = orderService.getAllOrdersByUserId(userId);
        List<OrderResponse> responses = orders.stream()
                .map(orderService::toOrderResponse)
                .collect(Collectors.toList());
        logger.info("Retrieved {} orders for userId: {}", responses.size(), userId);
        return ResponseEntity.ok(responses);
    }
}