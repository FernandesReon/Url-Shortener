package com.reon.backend.services.impl;

import com.reon.backend.dtos.UserRequest;
import com.reon.backend.dtos.UserResponse;
import com.reon.backend.exceptions.EmailAlreadyExistsException;
import com.reon.backend.mappers.UserMapper;
import com.reon.backend.models.User;
import com.reon.backend.repositories.UserRepository;
import com.reon.backend.services.OtpService;
import com.reon.backend.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final OtpService otpService;

    public UserServiceImpl(UserRepository userRepository, OtpService otpService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
    }

    @Override
    public UserResponse registerUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists.");
        }
        log.info("User Service:: creating new user: {}", userRequest);

        User user = UserMapper.mapToEntity(userRequest);
        String id = UUID.randomUUID().toString();
        user.setId(id);

        User newUser = userRepository.save(user);
        log.info("User Service:: created new user: {}", newUser);

        otpService.sendVerificationTokenEmail(userRequest.getEmail());

        return UserMapper.responseToUser(newUser);
    }
}
