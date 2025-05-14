package iuh.fit.cartservice.controller;

import iuh.fit.cartservice.dto.request.AddCartItemRequest;
import iuh.fit.cartservice.dto.request.RemoveCartItemRequest;
import iuh.fit.cartservice.dto.request.UpdateCartItemRequest;
import iuh.fit.cartservice.dto.response.CartResponse;
import iuh.fit.cartservice.service.CartService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateCartItem(
            @PathVariable String cartItemId,
            @RequestBody UpdateCartItemRequest request) {
        CartResponse cart = cartService.updateCartItem(cartItemId, request);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items")
    public ResponseEntity<CartResponse> removeItemFromCart(@RequestBody RemoveCartItemRequest request) {
        CartResponse cart = cartService.removeItemFromCart(request);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartResponse> getCartByUserId(@PathVariable String userId) {
        CartResponse cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        String path = "/api/carts";
        if (ex.getMessage().contains("Cart not found")) {
            path += "/user/" + ex.getMessage().split(": ")[1];
        } else if (ex.getMessage().contains("CartItem not found")) {
            path += "/items/" + ex.getMessage().split(": ")[1];
        }
        ErrorResponse error = new ErrorResponse(
                LocalDateTime.now(),
                404,
                "Not Found",
                ex.getMessage(),
                path
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @Data
    public static class ErrorResponse {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;
        private String path;

        public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
            this.timestamp = timestamp;
            this.status = status;
            this.error = error;
            this.message = message;
            this.path = path;
        }
    }
}