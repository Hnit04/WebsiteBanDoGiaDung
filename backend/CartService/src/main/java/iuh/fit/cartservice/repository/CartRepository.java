package iuh.fit.cartservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import iuh.fit.cartservice.model.Cart;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
}



