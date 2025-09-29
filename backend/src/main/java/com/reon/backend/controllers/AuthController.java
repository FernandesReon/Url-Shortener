package com.reon.backend.controllers;

import com.reon.backend.dtos.LoginRequest;
import com.reon.backend.dtos.UserRequest;
import com.reon.backend.dtos.UserResponse;
import com.reon.backend.jwt.JwtResponse;
import com.reon.backend.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${token.expiry_time}")
    private long tokenExpirationTime;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(
            name = "User Registration endpoint",
            path = "/register"
    )
    public ResponseEntity<UserResponse> userRegistration(@Valid @RequestBody UserRequest request) {
        log.info("Auth Controller:: Incoming registration request: {}", request);
        UserResponse response = userService.registerUser(request);
        log.info("Auth Controller:: Registered user: {}", response);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping(
            name = "User Authentication endpoint (login)",
            path = "/login"
    )
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest,
                                                        HttpServletResponse response) {
        log.info("Auth Controller:: Incoming login request: {}", loginRequest);
        JwtResponse jwtToken = userService.authenticateUser(loginRequest);

        // save the jwt token in cookie
        log.info("Auth Controller:: Saving the jwt token to Cookie");
        Cookie cookie = new Cookie("JWT", jwtToken.getToken());
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge((int) (tokenExpirationTime / 1000));
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
        log.info("Auth Controller:: Saved the cookie to Cookie");

        log.info("Auth Controller:: Authenticated user: {}", jwtToken);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(jwtToken);
    }

    @PostMapping(
            name = "User logout endpoint",
            path = "/logout"
    )
    public ResponseEntity<?> logout(HttpServletResponse response) {
        log.info("Auth Controller:: Logging out user");

        Cookie cookie = new Cookie("JWT", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);

        log.info("Auth Controller:: Logged out user");
        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
