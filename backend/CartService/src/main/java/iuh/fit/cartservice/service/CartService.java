package iuh.fit.cartservice.service;

import iuh.fit.cartservice.dto.CartItemRequest;
import iuh.fit.cartservice.dto.CartResponse;

public interface CartService {
    CartResponse getCart(String userId);
    CartResponse addToCart(String userId, CartItemRequest cartItemRequest);
    void removeFromCart(String userId, String productId);
    void clearCart(String userId);
}
