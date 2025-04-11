package iuh.fit.cartservice.dto;

import iuh.fit.cartservice.model.CartItem;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private String userId;
    private List<CartItem> items;
}
