package com.reon.backend.services;

import com.reon.backend.dtos.UserRequest;
import com.reon.backend.dtos.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest userRequest);
}
