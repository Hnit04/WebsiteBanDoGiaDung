package iuh.fit.orderservice.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import iuh.fit.orderservice.dto.request.*;
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
import org.springframework.web.client.RestClientException;
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
        logger.info("Initializing OrderService");
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.restTemplate = restTemplate;
    }

    public OrderResponse createOrder(CreateOrderRequest request) {
        logger.info("Processing CreateOrderRequest at {}", LocalDate.now());
        logger.debug("Request details: {}", request);

        // Kiểm tra orderDetails
        if (request.getOrderDetails() == null || request.getOrderDetails().isEmpty()) {
            logger.warn("No orderDetails provided in request at {}", LocalDate.now());
            throw new IllegalArgumentException("Chi tiết đơn hàng là bắt buộc.");
        }

        // Khởi tạo và xử lý orderDetails
        List<OrderDetail> orderDetails = new ArrayList<>();
        logger.info("Processing orderDetails list: {}", request.getOrderDetails().size());
        double calculatedTotal = 0.0;

        // Tạo Order trước để có orderId
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setPromotionId(request.getPromotionId());
        order.setCreatedDate(LocalDate.now());
        order.setStatus("PENDING");
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryStatus(request.getDeliveryStatus());
        order.setDeliveryDate(request.getDeliveryDate());

        for (OrderDetailRequest detail : request.getOrderDetails()) {
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrderDetailId(UUID.randomUUID().toString());
            orderDetail.setProductId(detail.getProductId());
            orderDetail.setQuantity(detail.getQuantity());

            // Gọi Product Service để lấy unitPrice
            String productUrl = "http://api-gateway:8080/api/products/" + detail.getProductId();
            logger.debug("Calling Product Service at: {}", productUrl);
            try {
                ResponseEntity<ProductResponse> response = restTemplate.getForEntity(productUrl, ProductResponse.class);
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    ProductResponse product = response.getBody();
                    if (product.getStock() >= detail.getQuantity()) {
                        orderDetail.setUnitPrice(product.getPrice());
                    } else {
                        logger.warn("Hết hàng cho sản phẩm: {}, dùng giá mặc định 75.0", detail.getProductId());
                        orderDetail.setUnitPrice(75.0);
                    }
                } else {
                    logger.warn("Không tìm thấy sản phẩm: {}, dùng giá mặc định 75.0", detail.getProductId());
                    orderDetail.setUnitPrice(75.0);
                }
            } catch (Exception e) {
                logger.error("Lỗi khi gọi Product Service: {}, dùng giá mặc định 75.0", e.getMessage(), e);
                orderDetail.setUnitPrice(75.0);
            }

            orderDetail.setSubtotal(orderDetail.getQuantity() * orderDetail.getUnitPrice());
            calculatedTotal += orderDetail.getSubtotal();
            // Gán orderId cho orderDetail (sẽ được cập nhật sau khi lưu order)
            orderDetails.add(orderDetail);
            logger.debug("Created OrderDetail: {}", orderDetail);
        }

        order.setTotalAmount(calculatedTotal);
        order.setOrderDetails(orderDetails);

        logger.debug("Order before save: {}", order);

        // Lưu Order
        Order savedOrder;
        try {
            savedOrder = orderRepository.save(order);
            logger.info("Order saved successfully with ID: {}", savedOrder.getOrderId());
            // Gán orderId cho tất cả orderDetails sau khi có orderId
            for (OrderDetail detail : savedOrder.getOrderDetails()) {
                detail.setOrderId(savedOrder.getOrderId());
            }
            // Lưu lại để cập nhật orderDetails
            savedOrder = orderRepository.save(savedOrder);
        } catch (Exception e) {
            logger.error("Failed to save Order: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể lưu Order: " + e.getMessage());
        }

        // Gọi payment-service
        try {
            String paymentUrl = "http://api-gateway:8080/api/payments";
            logger.info("Initiating payment request to: {}", paymentUrl);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            PaymentRequest paymentRequest = new PaymentRequest(
                    savedOrder.getOrderId(),
                    request.getPaymentMethodId(),
                    savedOrder.getTotalAmount()
            );
            logger.debug("Payment request body: {}", paymentRequest);
            HttpEntity<PaymentRequest> entity = new HttpEntity<>(paymentRequest, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    paymentUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            logger.info("Payment service response status: {}", response.getStatusCode());
            logger.debug("Payment service response body: {}", response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                savedOrder.setStatus("PAYMENT_SUCCESS");
            } else {
                savedOrder.setStatus("PAYMENT_FAILED");
                orderRepository.save(savedOrder);
                throw new RuntimeException("Thanh toán thất bại với trạng thái: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Payment processing failed: {}", e.getMessage(), e);
            savedOrder.setStatus("PAYMENT_FAILED");
            orderRepository.save(savedOrder);
            throw new RuntimeException("Lỗi thanh toán: " + e.getMessage());
        }

        // Lưu lại Order với trạng thái đã cập nhật
        Order finalOrder = orderRepository.save(savedOrder);
        logger.info("Final order saved with status: {}, ID: {}", finalOrder.getStatus(), finalOrder.getOrderId());
        return orderMapper.toOrderResponse(finalOrder);
    }

    public OrderResponse updateDeliveryStatus(String orderId, UpdateDeliveryStatus request) {
        logger.debug("Updating delivery status for orderId: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setDeliveryStatus(request.getDeliveryStatus());
        order.setDeliveryDate(request.getDeliveryDate());

        Order updatedOrder = orderRepository.save(order);
        logger.info("Delivery status updated for orderId: {}", orderId);
        return orderMapper.toOrderResponse(updatedOrder);
    }

    public OrderResponse updateOrder(String orderId, UpdateOrderRequest request) {
        logger.debug("Updating order with id: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setUserId(request.getUserId());
        order.setPromotionId(request.getPromotionId());
        order.setTotalAmount(request.getTotalAmount());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryStatus(request.getDeliveryStatus());
        order.setDeliveryDate(request.getDeliveryDate());

        Order updatedOrder = orderRepository.save(order);
        logger.info("Order updated with id: {}", orderId);
        return orderMapper.toOrderResponse(updatedOrder);
    }

    public void deleteOrder(String orderId) {
        logger.debug("Deleting order with id: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        orderRepository.delete(order);
        logger.info("Order with id {} deleted", orderId);
    }

    public Page<Order> getOrders(String userId, String status, Pageable pageable) {
        logger.debug("Fetching orders with userId: {}, status: {}", userId, status);
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

        logger.info("Retrieved {} orders", orderPage.getTotalElements());
        return new PageImpl<>(orderPage.getContent(), pageable, orderPage.getTotalElements());
    }

    public OrderResponse getOrderById(String id) {
        logger.debug("Fetching order by id: {}", id);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        logger.info("Order found with id: {}", id);
        return orderMapper.toOrderResponse(order);
    }

    public OrderResponse toOrderResponse(Order order) {
        logger.debug("Mapping order to response: {}", order);
        return orderMapper.toOrderResponse(order);
    }

    public OrderResponse addOrderDetail(String orderId, OrderDetailRequest request) {
        logger.debug("Adding order detail to orderId: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Validate product
        String productUrl = "http://api-gateway:8080/api/products/" + request.getProductId();
        logger.debug("Validating product at: {}", productUrl);
        ProductResponse product = null;
        try {
            ResponseEntity<ProductResponse> response = restTemplate.getForEntity(productUrl, ProductResponse.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                product = response.getBody();
                logger.info("Product found: productId={}, price={}, stock={}",
                        product.getProductId(), product.getPrice(), product.getStock());
            } else {
                logger.warn("Product not found or invalid response for productId: {}, status: {}",
                        request.getProductId(), response.getStatusCode());
                throw new RuntimeException("Product not found with id: " + request.getProductId());
            }
        } catch (RestClientException e) {
            logger.error("Failed to fetch product from ProductService for productId: {}, error: {}",
                    request.getProductId(), e.getMessage(), e);
            throw new RuntimeException("Unable to validate product due to service error: " + e.getMessage());
        }

        // Kiểm tra tồn kho
        if (product.getStock() < request.getQuantity()) {
            logger.warn("Insufficient stock for productId: {}, requested: {}, available: {}",
                    request.getProductId(), request.getQuantity(), product.getStock());
            throw new RuntimeException("Insufficient stock for product: " + request.getProductId());
        }

        // Gán unitPrice từ ProductService
        request.setUnitPrice(product.getPrice());
        logger.debug("Set unitPrice for productId: {} to {}", request.getProductId(), request.getUnitPrice());

        // Tạo OrderDetail
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

        // Cập nhật totalAmount
        double totalAmount = orderDetails.stream()
                .mapToDouble(OrderDetail::getSubtotal)
                .sum();
        order.setTotalAmount(totalAmount);

        // Lưu Order
        Order updatedOrder;
        try {
            updatedOrder = orderRepository.save(order);
            logger.info("Order detail added to orderId: {}, total now: {}", orderId, totalAmount);
        } catch (Exception e) {
            logger.error("Failed to save updated order for orderId: {}, error: {}", orderId, e.getMessage(), e);
            throw new RuntimeException("Failed to save order with new details: " + e.getMessage());
        }

        return orderMapper.toOrderResponse(updatedOrder);
    }
    public OrderResponse updateOrderDetail(String orderId, UpdateOrderDetailRequest request) {
        logger.debug("Updating order detail for orderId: {}, detailId: {}", orderId, request.getOrderDetailId());
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        List<OrderDetail> orderDetails = order.getOrderDetails();
        if (orderDetails == null || orderDetails.isEmpty()) {
            throw new RuntimeException("No order details found for order: " + orderId);
        }

        OrderDetail orderDetail = orderDetails.stream()
                .filter(d -> d.getOrderDetailId().equals(request.getOrderDetailId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order detail not found with id: " + request.getOrderDetailId()));

        // Cập nhật thông tin
        if (request.getQuantity() != null) {
            orderDetail.setQuantity(request.getQuantity());
        }
        if (request.getUnitPrice() != null) {
            orderDetail.setUnitPrice(request.getUnitPrice());
        }
        orderDetail.setSubtotal(orderDetail.getQuantity() * orderDetail.getUnitPrice());

        // Cập nhật totalAmount
        double totalAmount = orderDetails.stream()
                .mapToDouble(OrderDetail::getSubtotal)
                .sum();
        order.setTotalAmount(totalAmount);

        // Lưu lại Order
        Order updatedOrder = orderRepository.save(order);
        logger.info("Order detail updated for orderId: {}, total now: {}", orderId, totalAmount);
        return orderMapper.toOrderResponse(updatedOrder);
    }
    public List<Order> getAllOrdersByUserId(String userId) {
        return orderRepository.findByUserId(userId);
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
        private String productName;  // Thêm để khớp với JSON
        private String description;  // Thêm để khớp với JSON
        @JsonProperty("originalPrice")  // Ánh xạ từ JSON
        private double originalPrice;
        @JsonProperty("quantityInStock")  // Ánh xạ từ JSON
        private int stock;
        @JsonProperty("salePrice")  // Ánh xạ từ JSON
        private double price;  // Đổi tên để khớp với logic
        private String categoryId;  // Thêm để khớp với JSON
        private String imageUrl;  // Thêm để khớp với JSON
    }
}