package iuh.fit.cartservice.controller;

import iuh.fit.cartservice.dto.request.AddCartItemRequest;
import iuh.fit.cartservice.dto.request.RemoveCartItemRequest;
import iuh.fit.cartservice.dto.response.CartResponse;
import iuh.fit.cartservice.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(@RequestBody AddCartItemRequest request) {
        CartResponse cart = cartService.addItemToCart(request);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items")
    public ResponseEntity<CartResponse> removeItemFromCart(@RequestBody RemoveCartItemRequest request) {
        CartResponse cart = cartService.removeItemFromCart(request);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartResponse> getCartByUserId(@PathVariable String userId) {
        CartResponse cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }
}