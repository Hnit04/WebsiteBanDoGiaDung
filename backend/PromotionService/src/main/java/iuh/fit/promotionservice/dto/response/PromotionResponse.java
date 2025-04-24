package iuh.fit.promotionservice.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PromotionResponse {
    private String promotionId;
    private String promotionCode;
    private String description;
    private double discountPercentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private String categoryId;
}