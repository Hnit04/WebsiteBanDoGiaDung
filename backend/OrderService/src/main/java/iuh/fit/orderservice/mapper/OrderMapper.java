package iuh.fit.orderservice.mapper;

import iuh.fit.orderservice.dto.response.OrderDetailResponse;
import iuh.fit.orderservice.dto.response.OrderResponse;
import iuh.fit.orderservice.model.Order;
import iuh.fit.orderservice.model.OrderDetail;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OrderMapper {

    public OrderResponse toOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setUserId(order.getUserId());
        response.setPromotionId(order.getPromotionId());
        response.setCreatedDate(order.getCreatedDate());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setDeliveryAddress(order.getDeliveryAddress());
        response.setDeliveryStatus(order.getDeliveryStatus());
        response.setDeliveryDate(order.getDeliveryDate());
        if (order.getOrderDetails() != null) {
            response.setOrderDetails(order.getOrderDetails().stream()
                    .map(this::toOrderDetailResponse)
                    .collect(Collectors.toList()));
        }
        return response;
    }

    public OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail) {
        OrderDetailResponse response = new OrderDetailResponse();
        response.setOrderDetailId(orderDetail.getOrderDetailId());
        response.setQuantity(orderDetail.getQuantity());
        response.setUnitPrice(orderDetail.getUnitPrice());
        response.setSubtotal(orderDetail.getSubtotal());
        response.setOrderId(orderDetail.getOrderId());
        response.setProductId(orderDetail.getProductId());
        return response;
    }
}