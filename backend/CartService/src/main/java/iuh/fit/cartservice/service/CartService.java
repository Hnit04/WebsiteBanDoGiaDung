package iuh.fit.cartservice.service;

import iuh.fit.cartservice.dto.ProductDTO;
import iuh.fit.cartservice.dto.request.AddCartItemRequest;
import iuh.fit.cartservice.dto.request.RemoveCartItemRequest;
import iuh.fit.cartservice.dto.request.UpdateCartItemRequest;
import iuh.fit.cartservice.dto.response.CartResponse;
import iuh.fit.cartservice.mapper.CartMapper;
import iuh.fit.cartservice.model.Cart;
import iuh.fit.cartservice.model.CartItem;
import iuh.fit.cartservice.repository.CartItemRepository;
import iuh.fit.cartservice.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final CartMapper cartMapper;
    private final RestTemplate restTemplate;
    private static final String PRODUCT_SERVICE_URL = "https://websitebandogiadung-dqzs.onrender.com/api/products/";

    @Autowired
    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                       CartMapper cartMapper, RestTemplate restTemplate) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.cartMapper = cartMapper;
        this.restTemplate = restTemplate;
    }

    public CartResponse addItemToCart(AddCartItemRequest request) {
        Optional<Cart> optionalCart = cartRepository.findByUserId(request.getUserId());
        Cart cart;
        if (optionalCart.isEmpty()) {
            cart = new Cart();
            cart.setUserId(request.getUserId());
            cart.setTotalAmount(0.0);
            cart.setCartItems(new ArrayList<>());
            cart = cartRepository.save(cart);
        } else {
            cart = optionalCart.get();
        }

        Optional<CartItem> optionalCartItem = cartItemRepository.findByCartIdAndProductId(cart.getCartId(), request.getProductId());
        CartItem cartItem;
        boolean isNewItem = false;
        if (optionalCartItem.isPresent()) {
            cartItem = optionalCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        } else {
            cartItem = new CartItem();
            cartItem.setCartId(cart.getCartId());
            cartItem.setProductId(request.getProductId());
            cartItem.setQuantity(request.getQuantity());
            isNewItem = true;
        }

        String url = PRODUCT_SERVICE_URL + request.getProductId();
        ProductDTO product = restTemplate.getForObject(url, ProductDTO.class);
        if (product == null || product.getSalePrice() <= 0) {
            throw new RuntimeException("Product not found or invalid price for product: " + request.getProductId());
        }
        if (product.getQuantityInStock() < cartItem.getQuantity()) {
            throw new RuntimeException("Insufficient stock for product: " + request.getProductId());
        }
        cartItem.setProductName(product.getProductName());
        cartItem.setSubtotal(cartItem.getQuantity() * product.getSalePrice());

        cartItem = cartItemRepository.save(cartItem);

        if (isNewItem) {
            cart.getCartItems().add(cartItem);
        }

        List<CartItem> updatedCartItems = cartItemRepository.findByCartId(cart.getCartId());
        cart.setCartItems(updatedCartItems);
        cart.setTotalAmount(calculateTotalAmount(updatedCartItems));

        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartItem(String cartItemId, UpdateCartItemRequest request) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("CartItem not found with id: " + cartItemId));

        // Lưu cartId thành một biến final để sử dụng trong lambda
        final String cartId = cartItem.getCartId();

        if (request.getQuantity() != null) {
            if (request.getQuantity() < 0) {
                throw new IllegalArgumentException("Quantity cannot be negative");
            }
            cartItem.setQuantity(request.getQuantity());

            String url = PRODUCT_SERVICE_URL + cartItem.getProductId();
            ProductDTO product = restTemplate.getForObject(url, ProductDTO.class);
            if (product == null) {
                throw new RuntimeException("Product not found for product: " + cartItem.getProductId());
            }
            if (product.getQuantityInStock() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + cartItem.getProductId());
            }
            cartItem.setSubtotal(cartItem.getQuantity() * product.getSalePrice());
        }

        cartItem = cartItemRepository.save(cartItem);

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found with id: " + cartId));
        List<CartItem> updatedCartItems = cartItemRepository.findByCartId(cart.getCartId());
        cart.setCartItems(updatedCartItems);
        cart.setTotalAmount(calculateTotalAmount(updatedCartItems));

        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    public CartResponse removeItemFromCart(RemoveCartItemRequest request) {
        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + request.getUserId()));

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getCartId(), request.getProductId())
                .orElseThrow(() -> new RuntimeException("CartItem not found for product: " + request.getProductId()));

        cartItemRepository.delete(cartItem);

        List<CartItem> updatedCartItems = cartItemRepository.findByCartId(cart.getCartId());
        cart.setCartItems(updatedCartItems);
        cart.setTotalAmount(calculateTotalAmount(updatedCartItems));

        cartRepository.save(cart);

        return cartMapper.toCartResponse(cart);
    }

    public void clearCart(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
        cartItemRepository.deleteByCartId(cart.getCartId());
        cartRepository.delete(cart);
    }

    public CartResponse getCartByUserId(String userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));

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