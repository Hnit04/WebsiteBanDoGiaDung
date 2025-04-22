package iuh.fit.productservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
@Data
public class Product {
    @Id
    private String productId;
    private String productName;
    private String description;
    private double originalPrice;
    private int quantityInStock;
    private double salePrice;
    private String categoryId;
}