package iuh.fit.cartservice.repository;

import iuh.fit.cartservice.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserId(Long userId); // Tìm giỏ hàng theo ID người dùng
}
