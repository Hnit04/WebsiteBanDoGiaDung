package iuh.fit.productservice.controller;

import iuh.fit.productservice.dto.request.AddReviewRequest;
import iuh.fit.productservice.dto.request.CreateProductRequest;
import iuh.fit.productservice.dto.response.ProductResponse;
import iuh.fit.productservice.dto.response.ReviewResponse;
import iuh.fit.productservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody CreateProductRequest request) {
        ProductResponse product = productService.saveProduct(request);
        return ResponseEntity.status(201).body(product);
    }

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProductId(@PathVariable String productId) {
        List<ReviewResponse> reviews = productService.getReviewsByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> addReview(@RequestBody AddReviewRequest request) {
        ReviewResponse review = productService.addReview(request);
        return ResponseEntity.status(201).body(review);
    }
}