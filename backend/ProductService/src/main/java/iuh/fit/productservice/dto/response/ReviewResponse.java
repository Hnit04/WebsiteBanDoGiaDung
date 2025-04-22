package iuh.fit.productservice.dto.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ReviewResponse {
    private String reviewId;
    private int rating;
    private String comment;
    private LocalDate reviewDate;
    private String userId;
    private String productId;
}