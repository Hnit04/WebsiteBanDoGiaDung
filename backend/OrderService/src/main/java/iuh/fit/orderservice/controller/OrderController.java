package iuh.fit.orderservice.controller;

import iuh.fit.orderservice.dto.request.CreateOrderRequest;
import iuh.fit.orderservice.dto.request.UpdateDeliveryStatus;
import iuh.fit.orderservice.dto.response.OrderResponse;
import iuh.fit.orderservice.mapper.OrderMapper;
import iuh.fit.orderservice.model.Order;
import iuh.fit.orderservice.repository.OrderRepository;
import iuh.fit.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper; // Inject OrderMapper

    @Autowired
    public OrderController(OrderService orderService, OrderRepository orderRepository, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        OrderResponse orderResponse = orderService.createOrder(request);
        return ResponseEntity.status(201).body(orderResponse);
    }

    @PutMapping("/{orderId}/delivery-status")
    public ResponseEntity<OrderResponse> updateDeliveryStatus(
            @PathVariable String orderId,
            @RequestBody UpdateDeliveryStatus request) {
        OrderResponse orderResponse = orderService.updateDeliveryStatus(orderId, request);
        return ResponseEntity.ok(orderResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        return ResponseEntity.ok(orderMapper.toOrderResponse(order));
    }
}