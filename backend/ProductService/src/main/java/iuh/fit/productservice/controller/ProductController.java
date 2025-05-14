package iuh.fit.productservice.controller;

import iuh.fit.productservice.dto.request.AddReviewRequest;
import iuh.fit.productservice.dto.request.CreateProductRequest;
import iuh.fit.productservice.dto.response.CategoryResponse;
import iuh.fit.productservice.dto.response.ProductResponse;
import iuh.fit.productservice.dto.response.ReviewResponse;
import iuh.fit.productservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // Lấy danh sách tất cả products (có phân trang)
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    // Lấy product theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Tạo product mới
    @PostMapping
    public ResponseEntity<ProductResponse> saveProduct(@RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.saveProduct(request));
    }

    // Lấy danh sách reviews của product (có phân trang)
    @GetMapping("/{id}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getReviewsByProductId(@PathVariable String id, Pageable pageable) {
        return ResponseEntity.ok(productService.getReviewsByProductId(id, pageable));
    }

    // Thêm review cho product
    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> addReview(@RequestBody AddReviewRequest request) {
        return ResponseEntity.ok(productService.addReview(request));
    }

    // Lấy danh sách tất cả categories (không phân trang)
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }
}