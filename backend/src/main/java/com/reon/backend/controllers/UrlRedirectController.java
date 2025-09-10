package com.reon.backend.controllers;

import com.reon.backend.dtos.url.UrlResponse;
import com.reon.backend.exceptions.ShortCodeException;
import com.reon.backend.services.UrlMappingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping(
        name = "controller for redirecting to long url",
        path = "/api/redirect"
)
public class UrlRedirectController {
    private final Logger log = LoggerFactory.getLogger(UrlRedirectController.class);
    private final UrlMappingService urlMappingService;

    public UrlRedirectController(UrlMappingService urlMappingService) {
        this.urlMappingService = urlMappingService;
    }

    @GetMapping(
            name = "endpoint for redirecting shortUrl",
            path = "/{shortCode}"
    )
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        log.info("Url Redirect Controller :: Incoming request for redirecting shortUrl: {}", shortCode);
        try {
            UrlResponse response = urlMappingService.getOriginalUrl(shortCode);
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create(response.getLongUrl()));
            log.info("Url Redirect Controller :: Redirecting shortUrl: {}", shortCode);
            return ResponseEntity
                    .status(HttpStatus.FOUND)
                    .headers(headers)
                    .build();
        } catch (ShortCodeException exception) {
            log.warn("Url Redirect Controller :: Failed to redirect shortUrl: {}. Reason: {}", shortCode, exception.getMessage());
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }
}
