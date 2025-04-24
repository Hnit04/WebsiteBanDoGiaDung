package iuh.fit.productservice.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AddReviewRequest {
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private int rating;

    @Size(max = 500, message = "Comment must not exceed 500 characters")
    private String comment;

    private LocalDate reviewDate;

    @NotBlank(message = "User ID must not be blank")
    private String userId;

    @NotBlank(message = "Product ID must not be blank")
    private String productId;
}