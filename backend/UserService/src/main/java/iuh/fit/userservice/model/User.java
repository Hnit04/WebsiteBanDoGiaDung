package iuh.fit.userservice.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "users")
@Data
public class User {
    @Id
    private String userId;
    private String username;
    private String email;
    private String password;
    private String phone;
    private String address;
    private Role role;
}