package iuh.fit.productservice.dto.request;

import lombok.Data;

@Data
public class UpdateProductRequest {
    private String productName;
    private String description;
    private Double originalPrice;
    private Double salePrice;
    private Integer quantityInStock;
    private String categoryId;
    private String imageUrl;
}