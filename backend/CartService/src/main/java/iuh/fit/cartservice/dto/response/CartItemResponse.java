package iuh.fit.cartservice.dto.response;

import lombok.Data;

@Data
public class CartItemResponse {
    private String cartItemId;
    private String cartId;
    private String productId;
    private String productName;
    private int quantity;
    private double subtotal;
}