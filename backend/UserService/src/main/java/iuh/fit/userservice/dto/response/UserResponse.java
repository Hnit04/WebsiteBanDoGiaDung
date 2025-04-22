package iuh.fit.userservice.dto.response;

import iuh.fit.userservice.model.Role;
import lombok.Data;

@Data
public class UserResponse {
    private String userId;
    private String username;
    private String email;
    private String phone;
    private String address;
    private Role role;
}