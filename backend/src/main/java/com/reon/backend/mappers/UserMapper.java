package com.reon.backend.mappers;

import com.reon.backend.dtos.UserProfile;
import com.reon.backend.dtos.UserRequest;
import com.reon.backend.dtos.UserResponse;
import com.reon.backend.dtos.url.UrlResponse;
import com.reon.backend.mappers.UrlMapper;
import com.reon.backend.models.User;
import com.reon.backend.models.UrlMapping;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

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
        response.setRoles(user.getRoles());
        response.setEmailVerified(user.isEmailVerified());
        response.setAccountEnabled(user.isAccountEnabled());
        response.setCreatedOn(user.getCreatedOn());
        response.setUpdatedOn(user.getUpdatedOn());
        
        // Convert UrlMapping entities to UrlResponse DTOs to avoid circular references
        if (user.getUrlMappings() != null) {
            response.setUrlMappings(user.getUrlMappings().stream()
                    .map(UrlMapper::responseToUser)
                    .collect(Collectors.toSet()));
        }
        
        return response;
    }

    public static UserProfile toProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setId(user.getId());
        profile.setName(user.getName());
        profile.setEmail(user.getEmail());
        profile.setRoles(user.getRoles());
        return profile;
    }
}
