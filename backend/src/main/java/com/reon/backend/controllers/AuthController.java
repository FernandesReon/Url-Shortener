package com.reon.backend.controllers;

import com.reon.backend.dtos.UserRequest;
import com.reon.backend.dtos.UserResponse;
import com.reon.backend.services.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
        name = "auth controller (register, login, logout)",
        path = "/api/auth"
)
public class AuthController {
    private final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(
            name = "User Registration endpoint",
            path = "/register"
    )
    public ResponseEntity<UserResponse> userRegistration(@Valid @RequestBody UserRequest request) {
        log.info("Auth Controller:: Incoming request: {}", request);
        UserResponse response = userService.registerUser(request);
        log.info("Auth Controller:: Registered user: {}", response);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}
