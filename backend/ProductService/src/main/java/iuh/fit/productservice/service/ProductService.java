package iuh.fit.productservice.service;

import iuh.fit.productservice.dto.request.AddReviewRequest;
import iuh.fit.productservice.dto.request.CreateCategoryRequest;
import iuh.fit.productservice.dto.request.CreateProductRequest;
import iuh.fit.productservice.dto.request.UpdateProductRequest;
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
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final RestTemplate restTemplate;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public ProductService(ProductRepository productRepository,
                          ReviewRepository reviewRepository,
                          CategoryRepository categoryRepository,
                          ProductMapper productMapper,
                          RestTemplate restTemplate,
                          MongoTemplate mongoTemplate) {
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.categoryRepository = categoryRepository;
        this.productMapper = productMapper;
        this.restTemplate = restTemplate;
        this.mongoTemplate = mongoTemplate;
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


        if (!categoryRepository.existsById(request.getCategoryId())) {
            throw new IllegalArgumentException("Category not found with id: " + request.getCategoryId());
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

    @Transactional
    public ProductResponse updateProduct(String productId, UpdateProductRequest request) {
        logger.info("Updating product ID: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        if (request.getProductName() != null) {
            product.setProductName(request.getProductName());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getOriginalPrice() != null) {
            product.setOriginalPrice(request.getOriginalPrice());
        }
        if (request.getSalePrice() != null) {
            product.setSalePrice(request.getSalePrice());
            if (product.getSalePrice() > product.getOriginalPrice()) {
                throw new IllegalArgumentException("Sale price cannot be greater than original price");
            }
        }
        if (request.getQuantityInStock() != null) {
            product.setQuantityInStock(request.getQuantityInStock());
        }
        if (request.getCategoryId() != null) {
            if (!categoryRepository.existsById(request.getCategoryId())) {
                throw new IllegalArgumentException("Category not found with id: " + request.getCategoryId());
            }
            product.setCategoryId(request.getCategoryId());
        }
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }

        Product updatedProduct = productRepository.save(product);
        logger.info("Product updated with ID: {}", updatedProduct.getProductId());
        return productMapper.toProductResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(String productId) {
        logger.info("Deleting product ID: {}", productId);

        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }

        reviewRepository.deleteByProductId(productId);
        productRepository.deleteById(productId);
        logger.info("Product deleted with ID: {}", productId);
    }

    public Page<ProductResponse> searchProducts(String name, String categoryId, Double minPrice, Double maxPrice, Pageable pageable) {
        logger.debug("Searching products with name: {}, categoryId: {}, minPrice: {}, maxPrice: {}", name, categoryId, minPrice, maxPrice);

        Query query = new Query();
        if (name != null && !name.isEmpty()) {
            query.addCriteria(Criteria.where("productName").regex(name, "i"));
        }
        if (categoryId != null && !categoryId.isEmpty()) {
            query.addCriteria(Criteria.where("categoryId").is(categoryId));
        }
        if (minPrice != null) {
            query.addCriteria(Criteria.where("salePrice").gte(minPrice));
        }
        if (maxPrice != null) {
            query.addCriteria(Criteria.where("salePrice").lte(maxPrice));
        }

        List<Product> products = mongoTemplate.find(query.with(pageable), Product.class);
        long count = mongoTemplate.count(query, Product.class);
        Page<Product> page = PageableExecutionUtils.getPage(products, pageable, () -> count);
        return page.map(productMapper::toProductResponse);
    }

    public Page<ReviewResponse> getReviewsByProductId(String productId, Pageable pageable) {
        logger.debug("Fetching reviews for product ID: {} with pagination: {}", productId, pageable);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        Page<Review> reviews = reviewRepository.findByProductId(productId, pageable);
        return reviews.map(productMapper::toReviewResponse);
    }

    @Transactional
    public ReviewResponse addReview(AddReviewRequest request) {
        logger.info("Adding review for product ID: {}", request.getProductId());

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + request.getProductId()));

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

    @Transactional
    public ReviewResponse updateReview(String reviewId, AddReviewRequest request) {
        logger.info("Updating review ID: {}", reviewId);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ProductNotFoundException("Review not found with id: " + reviewId));

        if (!productRepository.existsById(request.getProductId())) {
            throw new ProductNotFoundException("Product not found with id: " + request.getProductId());
        }

        validateUser(request.getUserId());

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(request.getReviewDate());
        review.setUserId(request.getUserId());
        review.setProductId(request.getProductId());

        Review updatedReview = reviewRepository.save(review);
        logger.info("Review updated with ID: {}", updatedReview.getReviewId());
        return productMapper.toReviewResponse(updatedReview);
    }

    @Transactional
    public void deleteReview(String reviewId) {
        logger.info("Deleting review ID: {}", reviewId);

        if (!reviewRepository.existsById(reviewId)) {
            throw new ProductNotFoundException("Review not found with id: " + reviewId);
        }

        reviewRepository.deleteById(reviewId);
        logger.info("Review deleted with ID: {}", reviewId);
    }

    public Map<String, Double> getAverageRating(String productId) {
        logger.debug("Calculating average rating for product ID: {}", productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));

        List<Review> reviews = reviewRepository.findByProductId(productId);
        double averageRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);

        Map<String, Double> result = new HashMap<>();
        result.put("averageRating", averageRating);
        return result;
    }

    public List<CategoryResponse> getAllCategories() {
        logger.debug("Fetching all categories");
        List<Category> categories = categoryRepository.findAll();
        return productMapper.toCategoryResponseList(categories);
    }

    private void validateUser(String userId) {
        try {
            String userServiceUrl = "https://websitebandogiadung-dqzs.onrender.com/api/users/" + userId;
            ResponseEntity<String> response = restTemplate.getForEntity(userServiceUrl, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IllegalArgumentException("User not found with id: " + userId);
            }
        } catch (Exception e) {
            logger.error("Error validating user ID: {} - {}", userId, e.getMessage());
            throw new IllegalArgumentException("Error validating user ID: " + userId, e);
        }
    }
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        logger.info("Creating category: {}", request.getCategoryName());

        Category category = new Category();
        category.setCategoryName(request.getCategoryName());

        Category savedCategory = categoryRepository.save(category);
        logger.info("Category saved with ID: {}", savedCategory.getCategoryId());
        return productMapper.toCategoryResponse(savedCategory);
    }
}

