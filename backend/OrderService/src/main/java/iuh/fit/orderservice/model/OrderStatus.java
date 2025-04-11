package iuh.fit.orderservice.model;

public enum OrderStatus {
    PENDING,    // Chờ xử lý
    PAID,       // Đã thanh toán
    SHIPPED,    // Đã giao hàng
    DELIVERED,  // Đã nhận hàng
    CANCELLED   // Đã hủy
}
