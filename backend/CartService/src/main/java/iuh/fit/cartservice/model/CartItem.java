package iuh.fit.cartservice.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId; // ID sản phẩm
    private int quantity; // Số lượng sản phẩm

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart; // Giỏ hàng chứa sản phẩm này
}
