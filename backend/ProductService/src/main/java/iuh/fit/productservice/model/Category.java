package iuh.fit.productservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
@Data
public class Category {
    @Id
    private String categoryId;
    private String categoryName;
}