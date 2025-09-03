package com.reon.backend.services;

import com.reon.backend.dtos.UserResponse;
import org.springframework.data.domain.Page;

public interface AdminService {
    Page<UserResponse> fetchUsers(int pageNo, int pageSize);
    UserResponse fetchUserByEmail(String email);
}
