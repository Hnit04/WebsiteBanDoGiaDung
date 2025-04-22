package iuh.fit.userservice.dto.request;

import iuh.fit.userservice.model.Role;
import lombok.Data;

@Data
public class CreateUserRequest {
    private String username;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Role role;
}