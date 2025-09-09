package com.reon.backend.services;

import com.reon.backend.dtos.LoginRequest;
import com.reon.backend.dtos.UserProfile;
import com.reon.backend.dtos.UserRequest;
import com.reon.backend.dtos.UserResponse;
import com.reon.backend.jwt.JwtResponse;

public interface UserService {
    UserResponse registerUser(UserRequest userRequest);
    JwtResponse authenticateUser(LoginRequest loginRequest);
    UserProfile profile();
}
