package iuh.fit.productservice.mapper;

import iuh.fit.productservice.dto.response.ProductResponse;
import iuh.fit.productservice.dto.response.ReviewResponse;
import iuh.fit.productservice.model.Product;
import iuh.fit.productservice.model.Review;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductResponse toProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setProductName(product.getProductName());
        response.setDescription(product.getDescription());
        response.setOriginalPrice(product.getOriginalPrice());
        response.setQuantityInStock(product.getQuantityInStock());
        response.setSalePrice(product.getSalePrice());
        response.setCategoryId(product.getCategoryId());
        response.setImageUrl(product.getImageUrl()); // Ánh xạ trường mới
        return response;
    }

    public ReviewResponse toReviewResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setReviewId(review.getReviewId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setReviewDate(review.getReviewDate());
        response.setUserId(review.getUserId());
        response.setProductId(review.getProductId());
        return response;
    }

    public List<ProductResponse> toProductResponseList(List<Product> products) {
        return products.stream()
                .map(this::toProductResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> toReviewResponseList(List<Review> reviews) {
        return reviews.stream()
                .map(this::toReviewResponse)
                .collect(Collectors.toList());
    }
}