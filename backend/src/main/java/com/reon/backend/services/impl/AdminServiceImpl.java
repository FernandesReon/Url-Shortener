package com.reon.backend.services.impl;

import com.reon.backend.dtos.UserResponse;
import com.reon.backend.exceptions.UserNotFoundException;
import com.reon.backend.mappers.UserMapper;
import com.reon.backend.models.User;
import com.reon.backend.repositories.UserRepository;
import com.reon.backend.services.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {
    private final Logger log = LoggerFactory.getLogger(AdminServiceImpl.class);
    private final UserRepository userRepository;

    public AdminServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Page<UserResponse> fetchUsers(int pageNo, int pageSize) {
        log.info("Admin Service: fetching users from page {} and page size {}", pageNo, pageSize);
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize);
        Page<User> users = userRepository.findAll(pageable);
        return users.map(UserMapper::responseToUser);
    }

    @Override
    @Cacheable(value = "user", key = "#email")
    public UserResponse fetchUserByEmail(String email) {
        log.info("Admin Service: fetching user by email {}", email);
        User findUser = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email " + email + " not found")
        );
        return UserMapper.responseToUser(findUser);
    }
}
