package iuh.fit.paymentservice.repository;

import iuh.fit.paymentservice.model.PaymentMethod;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentMethodRepository extends MongoRepository<PaymentMethod, String> {
}