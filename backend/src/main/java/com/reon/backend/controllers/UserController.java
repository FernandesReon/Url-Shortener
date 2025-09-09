package com.reon.backend.controllers;

import com.reon.backend.dtos.UserProfile;
import com.reon.backend.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(
        name = "endpoints accessible for user after authentication.",
        path = "/api/user/"
)
public class UserController {
    private final Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(
            name = "endpoint for fetching authenticated user's profile",
            path = "/profile"
    )
    public ResponseEntity<UserProfile> fetchUserProfile() {
        log.info("User Controller :: Fetching User Profile");
        UserProfile profile = userService.profile();
        log.info("User Controller :: User Profile fetched successfully.");
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(profile);
    }
}
