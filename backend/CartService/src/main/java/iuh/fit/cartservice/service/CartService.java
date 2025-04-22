package iuh.fit.cartservice.service;

import iuh.fit.cartservice.dto.request.AddCartItemRequest;
import iuh.fit.cartservice.dto.request.RemoveCartItemRequest;
import iuh.fit.cartservice.dto.response.CartResponse;
import iuh.fit.cartservice.mapper.CartMapper;
import iuh.fit.cartservice.model.Cart;
import iuh.fit.cartservice.model.CartItem;
import iuh.fit.cartservice.repository.CartItemRepository;
import iuh.fit.cartservice.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;

    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartMapper = cartMapper;
    }

    public CartResponse addItemToCart(AddCartItemRequest request) {
        // Tìm giỏ hàng của user
        Optional<Cart> optionalCart = cartRepository.findByUserId(request.getUserId());
        Cart cart;
        if (optionalCart.isEmpty()) {
            cart = new Cart();
            cart.setUserId(request.getUserId());
            cart.setTotalAmount(0.0);
            cart.setCartItems(new ArrayList<>());
        } else {
            cart = optionalCart.get();
        }

        // Tìm CartItem nếu đã tồn tại
        Optional<CartItem> optionalCartItem = cartItemRepository.findByCartIdAndProductId(cart.getCartId(), request.getProductId());
        CartItem cartItem;
        if (optionalCartItem.isPresent()) {
            cartItem = optionalCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = new CartItem();
            cartItem.setCartId(cart.getCartId());
            cartItem.setProductId(request.getProductId());
            cartItem.setQuantity(request.getQuantity());
            cart.getCartItems().add(cartItem);
        }

        // Giả lập subtotal (sẽ cần gọi ProductService để lấy giá sản phẩm)
        cartItem.setSubtotal(cartItem.getQuantity() * 100.0); // Giả lập giá mỗi sản phẩm là 100.0

        // Cập nhật totalAmount
        cart.setTotalAmount(calculateTotalAmount(cart.getCartItems()));

        // Lưu Cart và CartItem
        cartRepository.save(cart);
        cartItemRepository.save(cartItem);

        return cartMapper.toCartResponse(cart);
    }

    public CartResponse removeItemFromCart(RemoveCartItemRequest request) {
        // Tìm giỏ hàng của user
        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + request.getUserId()));

        // Tìm và xóa CartItem
        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getCartId(), request.getProductId())
                .orElseThrow(() -> new RuntimeException("CartItem not found for product: " + request.getProductId()));

        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        // Cập nhật totalAmount
        cart.setTotalAmount(calculateTotalAmount(cart.getCartItems()));

        // Lưu Cart
        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    public CartResponse getCartByUserId(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

        // Load CartItems
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getCartId());
        cart.setCartItems(cartItems);

        return cartMapper.toCartResponse(cart);
    }

    private double calculateTotalAmount(List<CartItem> cartItems) {
        return cartItems.stream()
                .mapToDouble(CartItem::getSubtotal)
                .sum();
    }
}