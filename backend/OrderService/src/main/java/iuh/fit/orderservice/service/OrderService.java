package iuh.fit.orderservice.service;

import iuh.fit.orderservice.dto.request.CreateOrderRequest;
import iuh.fit.orderservice.dto.request.OrderDetailRequest;
import iuh.fit.orderservice.dto.request.UpdateDeliveryStatus;
import iuh.fit.orderservice.dto.request.UpdateOrderRequest;
import iuh.fit.orderservice.dto.response.OrderResponse;
import iuh.fit.orderservice.mapper.OrderMapper;
import iuh.fit.orderservice.model.Order;
import iuh.fit.orderservice.model.OrderDetail;
import iuh.fit.orderservice.repository.OrderRepository;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

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
        logger.info("Received CreateOrderRequest: {}", request);

        // Kiểm tra orderDetails
        if (request.getOrderDetails() == null || request.getOrderDetails().isEmpty()) {
            logger.warn("No orderDetails provided in request");
            throw new IllegalArgumentException("Chi tiết đơn hàng là bắt buộc.");
        }

        // Khởi tạo và xử lý orderDetails
        List<OrderDetail> orderDetails = new ArrayList<>();
        logger.info("Processing orderDetails: {}", request.getOrderDetails());
        double calculatedTotal = 0.0;

        for (OrderDetailRequest detail : request.getOrderDetails()) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrderDetailId(UUID.randomUUID().toString()); // Tạo ID cho orderDetail
            orderDetail.setProductId(detail.getProductId());
            orderDetail.setQuantity(detail.getQuantity());

            // Gọi Product Service để lấy unitPrice
            String productUrl = "http://api-gateway:8080/api/products/" + detail.getProductId();
            logger.info("Calling Product Service at: {}", productUrl);
            try {
                ResponseEntity<ProductResponse> response = restTemplate.getForEntity(productUrl, ProductResponse.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    ProductResponse product = response.getBody();
                    if (product.getStock() >= detail.getQuantity()) {
                        orderDetail.setUnitPrice(product.getPrice());
                    } else {
                        logger.warn("Hết hàng cho sản phẩm: {}, sử dụng giá mặc định", detail.getProductId());
                        orderDetail.setUnitPrice(75.0);
                    }
                } else {
                    logger.warn("Không tìm thấy sản phẩm: {}, sử dụng giá mặc định", detail.getProductId());
                    orderDetail.setUnitPrice(75.0);
                }
            } catch (Exception e) {
                logger.error("Lỗi khi gọi Product Service: {}", e.getMessage(), e);
                orderDetail.setUnitPrice(75.0);
            }

            orderDetail.setSubtotal(orderDetail.getQuantity() * orderDetail.getUnitPrice());
            calculatedTotal += orderDetail.getSubtotal();
            orderDetails.add(orderDetail);
            logger.info("Created OrderDetail: {}", orderDetail);
        }

        // Tạo Order và gán orderDetails
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setPromotionId(request.getPromotionId());
        order.setCreatedDate(LocalDate.now());
        order.setTotalAmount(calculatedTotal);
        order.setStatus("PENDING");
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryStatus(request.getDeliveryStatus());
        order.setDeliveryDate(request.getDeliveryDate());
        order.setOrderDetails(orderDetails); // Nhúng trực tiếp orderDetails

        logger.info("BEFORE SAVE: {}", order);

        // Lưu Order (bao gồm orderDetails)
        Order savedOrder;
        try {
            savedOrder = orderRepository.save(order);
            logger.info("AFTER SAVE: Order saved with ID: {}", savedOrder.getOrderId());
        } catch (Exception e) {
            logger.error("Lỗi khi lưu Order: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể lưu Order: " + e.getMessage());
        }

        // Gọi payment-service
        try {
            String paymentUrl = "http://api-gateway:8080/api/payments";
            logger.info("CALLING PAYMENT SERVICE at: {}", paymentUrl);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            PaymentRequest paymentRequest = new PaymentRequest(
                    savedOrder.getOrderId(),
                    request.getPaymentMethodId(),
                    savedOrder.getTotalAmount()
            );
            logger.info("PAYMENT REQUEST BODY: {}", paymentRequest);
            HttpEntity<PaymentRequest> entity = new HttpEntity<>(paymentRequest, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    paymentUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            logger.info("PAYMENT SERVICE RESPONSE STATUS: {}", response.getStatusCode());
            logger.info("PAYMENT SERVICE RESPONSE BODY: {}", response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                savedOrder.setStatus("PAYMENT_SUCCESS");
            } else {
                savedOrder.setStatus("PAYMENT_FAILED");
                orderRepository.save(savedOrder);
                throw new RuntimeException("Thanh toán thất bại với trạng thái: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Lỗi thanh toán: {}", e.getMessage(), e);
            savedOrder.setStatus("PAYMENT_FAILED");
            orderRepository.save(savedOrder);
            throw new RuntimeException("Lỗi thanh toán: " + e.getMessage());
        }

        // Lưu lại Order với trạng thái đã cập nhật
        Order finalOrder = orderRepository.save(savedOrder);
        logger.info("FINAL ORDER WITH DETAILS: {}", finalOrder);
        return orderMapper.toOrderResponse(finalOrder);
    }

    public OrderResponse updateDeliveryStatus(String orderId, UpdateDeliveryStatus request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setDeliveryStatus(request.getDeliveryStatus());
        order.setDeliveryDate(request.getDeliveryDate());

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toOrderResponse(updatedOrder);
    }

    public OrderResponse updateOrder(String orderId, UpdateOrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setUserId(request.getUserId());
        order.setPromotionId(request.getPromotionId());
        order.setTotalAmount(request.getTotalAmount());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryStatus(request.getDeliveryStatus());
        order.setDeliveryDate(request.getDeliveryDate());

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toOrderResponse(updatedOrder);
    }

    public void deleteOrder(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Không cần xóa orderDetails riêng vì chúng được nhúng
        orderRepository.delete(order);
    }

    public Page<Order> getOrders(String userId, String status, Pageable pageable) {
        Page<Order> orderPage;

        if (userId != null && status != null) {
            orderPage = orderRepository.findByUserIdAndStatus(userId, status, pageable);
        } else if (userId != null) {
            orderPage = orderRepository.findByUserId(userId, pageable);
        } else if (status != null) {
            orderPage = orderRepository.findByStatus(status, pageable);
        } else {
            orderPage = orderRepository.findAll(pageable);
        }

        return new PageImpl<>(orderPage.getContent(), pageable, orderPage.getTotalElements());
    }

    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        return orderMapper.toOrderResponse(order);
    }

    public OrderResponse toOrderResponse(Order order) {
        return orderMapper.toOrderResponse(order);
    }

    public OrderResponse addOrderDetail(String orderId, OrderDetailRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Validate product
        String productUrl = "http://api-gateway:8080/api/products/" + request.getProductId();
        try {
            ResponseEntity<ProductResponse> response = restTemplate.getForEntity(productUrl, ProductResponse.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RuntimeException("Product not found: " + request.getProductId());
            }
            ProductResponse product = response.getBody();
            if (product.getStock() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + request.getProductId());
            }
            request.setUnitPrice(product.getPrice());
        } catch (Exception e) {
            throw new RuntimeException("Error validating product: " + e.getMessage());
        }

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrderDetailId(UUID.randomUUID().toString());
        orderDetail.setProductId(request.getProductId());
        orderDetail.setQuantity(request.getQuantity());
        orderDetail.setUnitPrice(request.getUnitPrice());
        orderDetail.setSubtotal(request.getQuantity() * request.getUnitPrice());
        orderDetail.setOrderId(orderId);

        List<OrderDetail> orderDetails = order.getOrderDetails();
        if (orderDetails == null) {
            orderDetails = new ArrayList<>();
        }
        orderDetails.add(orderDetail);
        order.setOrderDetails(orderDetails);

        double totalAmount = orderDetails.stream()
                .mapToDouble(OrderDetail::getSubtotal)
                .sum();
        order.setTotalAmount(totalAmount);

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toOrderResponse(updatedOrder);
    }

    @Data
    private static class PaymentRequest {
        private final String orderId;
        private final String paymentMethodId;
        private final double amount;
    }

    @Data
    private static class ProductResponse {
        private String productId;
        private double price;
        private int stock;
    }
}