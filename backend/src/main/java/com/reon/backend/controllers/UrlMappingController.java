package com.reon.backend.controllers;

import com.reon.backend.dtos.url.UrlRequest;
import com.reon.backend.dtos.url.UrlResponse;
import com.reon.backend.exceptions.UserNotFoundException;
import com.reon.backend.models.User;
import com.reon.backend.repositories.UserRepository;
import com.reon.backend.services.UrlMappingService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(
        name = "Only endpoints related to url mapping",
        path = "/api/url"
)
public class UrlMappingController {
    private final Logger log = LoggerFactory.getLogger(UrlMappingController.class);
    private final UrlMappingService urlMappingService;
    private final UserRepository userRepository;

    public UrlMappingController(UrlMappingService urlMappingService, UserRepository userRepository) {
        this.urlMappingService = urlMappingService;
        this.userRepository = userRepository;
    }

    @PostMapping(
            name = "endpoint for creating short url",
            path = "/shorten"
    )
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UrlResponse> createShortUrl(@Valid @RequestBody UrlRequest urlRequest,
                                                      Principal principal) {
        log.info("Url Mapping Controller :: Creating short url for: {}", urlRequest.getLongUrl());
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(
                () -> new UserNotFoundException("User not found with email: " + principal.getName())
        );
        UrlResponse urlResponse = urlMappingService.createShortUrl(urlRequest, user);
        log.info("Url Mapping Controller :: Created a short url: {}, for long url: {}", urlResponse.getShortUrl(), urlResponse.getLongUrl());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(urlResponse);
    }

    @GetMapping(
            name = "endpoint for fetching all urls"
    )
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<UrlResponse>> fetchAllUrls(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            Principal principal)
    {
        log.info("Url Mapping Controller :: Fetching urls for page: {}, size: {}", page, size);
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(
                () -> new UserNotFoundException("User not found with email: " + principal.getName())
        );
        Page<UrlResponse> url_list = urlMappingService.viewAllUrls(page, size, user);
        log.info("Url Mapping Controller :: Fetched urls for page: {}, size: {}", page, size);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(url_list);
    }
}
