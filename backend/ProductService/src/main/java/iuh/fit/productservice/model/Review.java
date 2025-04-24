package iuh.fit.productservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "reviews")
@Data
public class Review {
    @Id
    private String reviewId;
    private int rating;
    private String comment;
    private LocalDate reviewDate;
    private String userId;
    private String productId;

}