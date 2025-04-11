package iuh.fit.cartservice.model;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItem {
    private String productId;
    private String productName;
    private int quantity;
    private double price;
}
