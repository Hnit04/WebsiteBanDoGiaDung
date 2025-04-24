package iuh.fit.cartservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cart_items")
@Data
public class CartItem {
    @Id
    private String cartItemId;
    private String cartId;
    private String productId;
    private String productName;
    private int quantity;
    private double subtotal;
}