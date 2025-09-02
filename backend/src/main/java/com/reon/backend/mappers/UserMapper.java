package com.reon.backend.mappers;

import com.reon.backend.dtos.UserRequest;
import com.reon.backend.dtos.UserResponse;
import com.reon.backend.models.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public static User mapToEntity(UserRequest userRequest) {
        User user = new User();
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(userRequest.getPassword());
        return user;
    }

    public static UserResponse responseToUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPassword(user.getPassword());
        response.setRoles(user.getRoles());
        response.setEmailVerified(user.isEmailVerified());
        response.setAccountEnabled(user.isAccountEnabled());
        response.setCreatedOn(user.getCreatedOn());
        response.setUpdatedOn(response.getCreatedOn());
        response.setUrlMappings(user.getUrlMappings());
        return response;
    }
}
