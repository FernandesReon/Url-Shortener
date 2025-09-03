package com.reon.backend.controllers;

import com.reon.backend.dtos.UserResponse;
import com.reon.backend.services.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
        name = "Only admin related endpoints",
        path = "/api/admin"
)
public class AdminController {
    private final Logger log = LoggerFactory.getLogger(AdminController.class);
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping(
            name = "Endpoint to fetch all users",
            path = "/users"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> fetchAllUsers(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "pageSize", defaultValue = "10") int pageSize
    ) {
        log.info("Admin Controller:: fetching users from pageNo:{} pageSize:{}", pageNo, pageSize);
        Page<UserResponse> users = adminService.fetchUsers(pageNo, pageSize);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(users);
    }

    @GetMapping(
            name = "Endpoint for fetching user via email id",
            path = "email/{email}"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> fetchUserByEmail(@PathVariable String email) {
        log.info("Admin Controller:: fetching user by email:{}", email);
        UserResponse user = adminService.fetchUserByEmail(email);
        log.info("Admin Controller:: fetched user by email:{}", email);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(user);
    }
}
