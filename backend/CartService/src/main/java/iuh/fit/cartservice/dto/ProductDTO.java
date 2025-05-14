package iuh.fit.cartservice.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private String productId;
    private String productName;
    private double salePrice;
    private int quantityInStock;

    // Thêm ràng buộc cơ bản (tùy chọn)
    public void setSalePrice(double salePrice) {
        if (salePrice < 0) {
            throw new IllegalArgumentException("Sale price cannot be negative");
        }
        this.salePrice = salePrice;
    }

    public void setQuantityInStock(int quantityInStock) {
        if (quantityInStock < 0) {
            throw new IllegalArgumentException("Quantity in stock cannot be negative");
        }
        this.quantityInStock = quantityInStock;
    }
}