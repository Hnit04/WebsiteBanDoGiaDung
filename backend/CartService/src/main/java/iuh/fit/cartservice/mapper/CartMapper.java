package iuh.fit.cartservice.mapper;

import iuh.fit.cartservice.dto.response.CartItemResponse;
import iuh.fit.cartservice.dto.response.CartResponse;
import iuh.fit.cartservice.model.Cart;
import iuh.fit.cartservice.model.CartItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CartMapper {

    public CartResponse toCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setCartId(cart.getCartId());
        response.setUserId(cart.getUserId());
        response.setTotalAmount(cart.getTotalAmount());
        if (cart.getCartItems() != null) {
            response.setCartItems(toCartItemResponseList(cart.getCartItems()));
        }
        return response;
    }

    public CartItemResponse toCartItemResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();
        response.setCartItemId(cartItem.getCartItemId());
        response.setCartId(cartItem.getCartId());
        response.setProductId(cartItem.getProductId());
        response.setQuantity(cartItem.getQuantity());
        response.setSubtotal(cartItem.getSubtotal());
        return response;
    }

    public List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());
    }
}