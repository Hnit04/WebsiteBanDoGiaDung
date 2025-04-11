package iuh.fit.orderservice.repository;

import iuh.fit.orderservice.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderRepository extends MongoRepository<Order, String> {
}
