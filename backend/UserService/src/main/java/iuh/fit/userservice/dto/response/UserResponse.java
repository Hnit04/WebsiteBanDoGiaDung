package iuh.fit.userservice.dto.response;
import lombok.Data;

@Data
public class UserResponse {
    private String userId;
    private String username;
    private String email;
    private String phone;
    private String address;
    private String role;
}