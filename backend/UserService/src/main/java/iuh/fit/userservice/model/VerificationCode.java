package iuh.fit.userservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "verification_codes")
public class VerificationCode {
    @Id
    private String id;
    private String email;
    private String code;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    // Constructors
    public VerificationCode() {}

    public VerificationCode(String email, String code, LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.email = email;
        this.code = code;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}