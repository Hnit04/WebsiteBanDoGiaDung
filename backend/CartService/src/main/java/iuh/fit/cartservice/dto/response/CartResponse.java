package iuh.fit.cartservice.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private String cartId;
    private String userId;
    private double totalAmount;
    private List<CartItemResponse> cartItems;
}