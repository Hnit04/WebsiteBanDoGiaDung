package iuh.fit.productservice.service;

import org.springframework.http.HttpStatus;

public class ProductNotFoundException extends RuntimeException {
    private final HttpStatus status;

    public ProductNotFoundException(String message) {
        super(message);
        this.status = HttpStatus.NOT_FOUND;
    }

    public HttpStatus getStatus() {
        return status;
    }
}