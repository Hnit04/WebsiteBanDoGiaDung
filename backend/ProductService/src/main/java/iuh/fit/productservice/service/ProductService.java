package iuh.fit.productservice.service;

import iuh.fit.productservice.dto.request.AddReviewRequest;
import iuh.fit.productservice.dto.request.CreateProductRequest;
import iuh.fit.productservice.dto.response.ProductResponse;
import iuh.fit.productservice.dto.response.ReviewResponse;
import iuh.fit.productservice.mapper.ProductMapper;
import iuh.fit.productservice.model.Product;
import iuh.fit.productservice.model.Review;
import iuh.fit.productservice.repository.ProductRepository;
import iuh.fit.productservice.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final ProductMapper productMapper;

    @Autowired
    public ProductService(ProductRepository productRepository, ReviewRepository reviewRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.productMapper = productMapper;
    }

    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return productMapper.toProductResponseList(products);
    }

    public ProductResponse getProductById(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return productMapper.toProductResponse(product);
    }

    public ProductResponse saveProduct(CreateProductRequest request) {
        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setQuantityInStock(request.getQuantityInStock());
        product.setSalePrice(request.getSalePrice());
        product.setCategoryId(request.getCategoryId());

        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }

    public List<ReviewResponse> getReviewsByProductId(String productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return productMapper.toReviewResponseList(reviews);
    }

    public ReviewResponse addReview(AddReviewRequest request) {
        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(request.getReviewDate());
        review.setUserId(request.getUserId());
        review.setProductId(request.getProductId());

        Review savedReview = reviewRepository.save(review);
        return productMapper.toReviewResponse(savedReview);
    }
}