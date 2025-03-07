package iuh.fit.productservice.service;

import iuh.fit.productservice.model.Product;
import iuh.fit.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    // Lấy tất cả sản phẩm
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Lấy sản phẩm theo ID
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    // Lưu sản phẩm mới
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Cập nhật sản phẩm
    public Product updateProduct(String id, Product newProduct) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setName(newProduct.getName());
                    existingProduct.setPrice(newProduct.getPrice());
                    return productRepository.save(existingProduct);
                })
                .orElseThrow(() -> new RuntimeException("Product not found!"));
    }

    // Xóa sản phẩm theo ID
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
