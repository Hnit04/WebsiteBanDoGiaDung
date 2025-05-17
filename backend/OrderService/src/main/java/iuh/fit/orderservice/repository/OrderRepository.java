package iuh.fit.orderservice.repository;

import iuh.fit.orderservice.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    Page<Order> findByUserId(String userId, Pageable pageable);
    Page<Order> findByStatus(String status, Pageable pageable);
    Page<Order> findByUserIdAndStatus(String userId, String status, Pageable pageable);
    List<Order> findByUserId(String userId);
}