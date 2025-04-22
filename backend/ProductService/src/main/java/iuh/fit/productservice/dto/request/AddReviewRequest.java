package iuh.fit.productservice.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AddReviewRequest {
    private int rating;
    private String comment;
    private LocalDate reviewDate=LocalDate.now();
    private String userId;
    private String productId;
}