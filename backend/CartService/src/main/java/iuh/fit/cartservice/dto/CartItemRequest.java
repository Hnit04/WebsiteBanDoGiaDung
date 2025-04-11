package iuh.fit.cartservice.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequest {
    private String productId;
    private String productName;
    private int quantity;
    private double price;
}
