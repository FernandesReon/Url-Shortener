package com.reon.backend.services.impl;

import com.reon.backend.dtos.LoginRequest;
import com.reon.backend.dtos.UserRequest;
import com.reon.backend.dtos.UserResponse;
import com.reon.backend.exceptions.EmailAlreadyExistsException;
import com.reon.backend.jwt.JwtResponse;
import com.reon.backend.jwt.JwtUtils;
import com.reon.backend.mappers.UserMapper;
import com.reon.backend.models.User;
import com.reon.backend.repositories.UserRepository;
import com.reon.backend.services.OtpService;
import com.reon.backend.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    private final UserRepository userRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public UserServiceImpl(UserRepository userRepository, OtpService otpService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public UserResponse registerUser(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists.");
        }
        log.info("User Service:: creating new user: {}", userRequest);

        User user = UserMapper.mapToEntity(userRequest);
        // unique id for each user
        String id = UUID.randomUUID().toString();
        user.setId(id);
        // password get encoded
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        User newUser = userRepository.save(user);
        log.info("User Service:: created new user: {}", newUser);

        otpService.sendVerificationTokenEmail(userRequest.getEmail());

        return UserMapper.responseToUser(newUser);
    }

    /*
    Authenticates user with provided credentials and generates a JWT token.
     */
    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        log.info("User Service:: authenticating user: {}", loginRequest);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtUtils.generateToken((User) userDetails);
        return new JwtResponse(jwtToken);
    }
}
