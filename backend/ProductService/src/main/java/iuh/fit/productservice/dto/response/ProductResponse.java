package iuh.fit.productservice.dto.response;

import lombok.Data;

@Data
public class ProductResponse {
    private String productId;
    private String productName;
    private String description;
    private double originalPrice;
    private int quantityInStock;
    private double salePrice;
    private String categoryId;
}