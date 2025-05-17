package iuh.fit.userservice.dto.request;

import jakarta.validation.constraints.NotBlank;

public class VerifyCodeRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Verification code is required")
    private String code;

    private CreateUserRequest userRequest;

    // Getters and Setters
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

    public CreateUserRequest getUserRequest() {
        return userRequest;
    }

    public void setUserRequest(CreateUserRequest userRequest) {
        this.userRequest = userRequest;
    }
}