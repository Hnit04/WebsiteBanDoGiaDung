package iuh.fit.productservice.dto.request;

import lombok.Data;

@Data
public class CreateProductRequest {
    private String productName;
    private String description;
    private double originalPrice;
    private int quantityInStock;
    private double salePrice;
    private String categoryId;
}