package iuh.fit.userservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String userId;
    private String username;
    private String password;
    private String email;
    private String phone;
    private String address;
    private Role role;
}