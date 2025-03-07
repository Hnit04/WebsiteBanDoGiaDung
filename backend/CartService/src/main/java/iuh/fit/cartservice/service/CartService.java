package iuh.fit.cartservice.service;

import iuh.fit.cartservice.model.Cart;
import iuh.fit.cartservice.model.CartItem;
import iuh.fit.cartservice.repository.CartRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

    // Lấy giỏ hàng theo userId
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId).orElse(new Cart(null, userId, null));
    }

    // Thêm sản phẩm vào giỏ hàng
    @Transactional
    public Cart addToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartByUserId(userId);

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            cart.getItems().add(new CartItem(null, productId, quantity, cart));
        }

        return cartRepository.save(cart);
    }

    // Xóa giỏ hàng của user
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteById(getCartByUserId(userId).getId());
    }
}
