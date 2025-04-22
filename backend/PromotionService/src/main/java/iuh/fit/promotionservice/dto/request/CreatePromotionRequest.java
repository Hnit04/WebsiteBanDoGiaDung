package iuh.fit.promotionservice.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreatePromotionRequest {
    private String promotionCode;
    private String description;
    private double discountPercentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private String categoryId;
}