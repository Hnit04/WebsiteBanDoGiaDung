package iuh.fit.userservice.mapper;

import iuh.fit.userservice.dto.response.UserResponse;
import iuh.fit.userservice.model.Role;
import iuh.fit.userservice.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "role", target = "role", resultType = String.class)
    UserResponse toUserResponse(User user);

    default String mapRoleToString(Role role) {
        return role != null ? role.name() : null;
    }
}