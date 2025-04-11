package iuh.fit.cartservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;


import java.util.ArrayList;
import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "cart")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cart {
    @Id
    private String id; // ID giỏ hàng (User ID)
    List<CartItem> items = new ArrayList<>();
}
