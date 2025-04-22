package iuh.fit.promotionservice.repository;

import iuh.fit.promotionservice.model.Promotion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PromotionRepository extends MongoRepository<Promotion, String> {
    List<Promotion> findByCategoryId(String categoryId);

    @Query("{ 'startDate': { $lte: ?0 }, 'endDate': { $gte: ?0 } }")
    List<Promotion> findActivePromotions(LocalDate currentDate);
}