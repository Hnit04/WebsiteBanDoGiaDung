package iuh.fit.promotionservice.service;

import iuh.fit.promotionservice.dto.request.CreatePromotionRequest;
import iuh.fit.promotionservice.dto.response.PromotionResponse;
import iuh.fit.promotionservice.mapper.PromotionMapper;
import iuh.fit.promotionservice.model.Promotion;
import iuh.fit.promotionservice.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;

    @Autowired
    public PromotionService(PromotionRepository promotionRepository, PromotionMapper promotionMapper) {
        this.promotionRepository = promotionRepository;
        this.promotionMapper = promotionMapper;
    }

    public PromotionResponse createPromotion(CreatePromotionRequest request) {
        Promotion promotion = new Promotion();
        promotion.setPromotionCode(request.getPromotionCode());
        promotion.setDescription(request.getDescription());
        promotion.setDiscountPercentage(request.getDiscountPercentage());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setCategoryId(request.getCategoryId());

        Promotion savedPromotion = promotionRepository.save(promotion);
        return promotionMapper.toPromotionResponse(savedPromotion);
    }

    public List<PromotionResponse> getPromotionsByCategoryId(String categoryId) {
        List<Promotion> promotions = promotionRepository.findByCategoryId(categoryId);
        return promotionMapper.toPromotionResponseList(promotions);
    }

    public List<PromotionResponse> getActivePromotions() {
        LocalDate currentDate = LocalDate.now();
        List<Promotion> activePromotions = promotionRepository.findActivePromotions(currentDate);
        return promotionMapper.toPromotionResponseList(activePromotions);
    }
}