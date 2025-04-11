package iuh.fit.cartservice.service;

import iuh.fit.cartservice.dto.CartItemRequest;
import iuh.fit.cartservice.dto.CartResponse;
import iuh.fit.cartservice.exception.CartNotFoundException;
import iuh.fit.cartservice.model.Cart;
import iuh.fit.cartservice.model.CartItem;
import iuh.fit.cartservice.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;

    @Override
    public CartResponse getCart(String userId) {
        Cart cart = cartRepository.findById(userId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found for user: " + userId));
        return new CartResponse(cart.getId(), cart.getItems());
    }

    @Override
    public CartResponse addToCart(String userId, CartItemRequest cartItemRequest) {
        Cart cart = cartRepository.findById(userId).orElse(new Cart(userId, new ArrayList<>()));


        List<CartItem> items = cart.getItems();
        items.add(new CartItem(cartItemRequest.getProductId(), cartItemRequest.getProductName(),
                cartItemRequest.getQuantity(), cartItemRequest.getPrice()));

        cart.setItems(items);
        cartRepository.save(cart);

        return new CartResponse(cart.getId(), cart.getItems());
    }

    @Override
    public void removeFromCart(String userId, String productId) {
        Cart cart = cartRepository.findById(userId)
                .orElseThrow(() -> new CartNotFoundException("Cart not found for user: " + userId));

        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        cartRepository.save(cart);
    }

    @Override
    public void clearCart(String userId) {
        cartRepository.deleteById(userId);
    }
}
