package com.reon.backend.dtos;

import com.reon.backend.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {
    private String id;
    private String name;
    private String email;
    private Set<User.Role> roles;
}
