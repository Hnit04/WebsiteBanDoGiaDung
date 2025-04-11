package iuh.fit.productservice.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products") // Định nghĩa collection trong MongoDB
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private Category category; // Danh mục sản phẩm (nhúng trong product)
}
