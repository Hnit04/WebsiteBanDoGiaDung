package iuh.fit.promotionservice.mapper;

import iuh.fit.promotionservice.dto.response.PromotionResponse;
import iuh.fit.promotionservice.model.Promotion;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PromotionMapper {

    public PromotionResponse toPromotionResponse(Promotion promotion) {
        PromotionResponse response = new PromotionResponse();
        response.setPromotionId(promotion.getPromotionId());
        response.setPromotionCode(promotion.getPromotionCode());
        response.setDescription(promotion.getDescription());
        response.setDiscountPercentage(promotion.getDiscountPercentage());
        response.setStartDate(promotion.getStartDate());
        response.setEndDate(promotion.getEndDate());
        response.setCategoryId(promotion.getCategoryId());
        return response;
    }

    public List<PromotionResponse> toPromotionResponseList(List<Promotion> promotions) {
        return promotions.stream()
                .map(this::toPromotionResponse)
                .collect(Collectors.toList());
    }
}