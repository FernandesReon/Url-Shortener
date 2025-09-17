package com.reon.backend.dtos;

import com.reon.backend.dtos.url.UrlResponse;
import com.reon.backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private Set<User.Role> roles;
    private boolean emailVerified;
    private boolean accountEnabled;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
    private Set<UrlResponse> urlMappings;
}
