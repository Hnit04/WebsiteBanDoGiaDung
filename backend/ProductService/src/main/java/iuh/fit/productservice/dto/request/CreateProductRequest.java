package iuh.fit.productservice.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateProductRequest {
    @NotBlank(message = "Product name must not be blank")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    private String productName;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Min(value = 0, message = "Original price must be greater than or equal to 0")
    private double originalPrice;

    @Min(value = 0, message = "Quantity in stock must be greater than or equal to 0")
    private int quantityInStock;

    @Min(value = 0, message = "Sale price must be greater than or equal to 0")
    private double salePrice;

    private String categoryId;
}