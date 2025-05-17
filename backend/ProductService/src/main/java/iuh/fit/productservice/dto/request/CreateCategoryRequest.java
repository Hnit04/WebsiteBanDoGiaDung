package iuh.fit.productservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCategoryRequest {
    @NotBlank(message = "Category name must not be blank")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    private String categoryName;
}