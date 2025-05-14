package iuh.fit.productservice.service;

import iuh.fit.productservice.dto.request.AddReviewRequest;
import iuh.fit.productservice.dto.request.CreateProductRequest;
import iuh.fit.productservice.dto.response.CategoryResponse;
import iuh.fit.productservice.dto.response.ProductResponse;
import iuh.fit.productservice.dto.response.ReviewResponse;
import iuh.fit.productservice.mapper.ProductMapper;
import iuh.fit.productservice.model.Category;
import iuh.fit.productservice.model.Product;
import iuh.fit.productservice.model.Review;
import iuh.fit.productservice.repository.CategoryRepository;
import iuh.fit.productservice.repository.ProductRepository;
import iuh.fit.productservice.repository.ReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final RestTemplate restTemplate;

    @Autowired
    public ProductService(ProductRepository productRepository,
                          ReviewRepository reviewRepository,
                          CategoryRepository categoryRepository,
                          ProductMapper productMapper,
                          RestTemplate restTemplate) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
        this.restTemplate = restTemplate;
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        logger.debug("Fetching all products with pagination: {}", pageable);
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(productMapper::toProductResponse);
    }

    public ProductResponse getProductById(String productId) {
        logger.debug("Fetching product by ID: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));
        return productMapper.toProductResponse(product);
    }

    @Transactional
    public ProductResponse saveProduct(CreateProductRequest request) {
        logger.info("Saving product: {}", request.getProductName());

        if (request.getSalePrice() > request.getOriginalPrice()) {
            throw new IllegalArgumentException("Sale price cannot be greater than original price");
        }

        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setQuantityInStock(request.getQuantityInStock());
        product.setSalePrice(request.getSalePrice());
        product.setCategoryId(request.getCategoryId());
        product.setImageUrl(request.getImageUrl());

        Product savedProduct = productRepository.save(product);
        logger.info("Product saved with ID: {}", savedProduct.getProductId());
        return productMapper.toProductResponse(savedProduct);
    }

    public Page<ReviewResponse> getReviewsByProductId(String productId, Pageable pageable) {
        logger.debug("Fetching reviews for product ID: {} with pagination: {}", productId, pageable);

        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }

        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
        return reviews.map(productMapper::toReviewResponse);
    }

    @Transactional
    public ReviewResponse addReview(AddReviewRequest request) {
        logger.info("Adding review for product ID: {}", request.getProductId());

        if (!productRepository.existsById(request.getProductId())) {
            throw new ProductNotFoundException("Product not found with id: " + request.getProductId());
        }

        validateUser(request.getUserId());

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(request.getReviewDate());
        review.setUserId(request.getUserId());
        review.setProductId(request.getProductId());

        Review savedReview = reviewRepository.save(review);
        logger.info("Review added with ID: {}", savedReview.getReviewId());
        return productMapper.toReviewResponse(savedReview);
    }

    private void validateUser(String userId) {
        try {
            String userServiceUrl = "http://api-gateway:8080/api/users/" + userId;
            ResponseEntity<String> response = restTemplate.getForEntity(userServiceUrl, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IllegalArgumentException("User not found with id: " + userId);
            }
        } catch (Exception e) {
            logger.error("Error validating user ID: {} - {}", userId, e.getMessage());
            throw new IllegalArgumentException("Error validating user ID: " + userId, e);
        }
    }

    public List<CategoryResponse> getAllCategories() {
        logger.debug("Fetching all categories");
        List<Category> categories = categoryRepository.findAll();
        return productMapper.toCategoryResponseList(categories);
    }
}

class ProductNotFoundException extends RuntimeException {
    private final HttpStatus status;

    public ProductNotFoundException(String message) {
        super(message);
        this.status = HttpStatus.NOT_FOUND;
    }

    public HttpStatus getStatus() {
        return status;
    }
}