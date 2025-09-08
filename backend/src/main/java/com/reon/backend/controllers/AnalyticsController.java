package com.reon.backend.controllers;

import com.reon.backend.dtos.analytics.Analytics;
import com.reon.backend.exceptions.UserNotFoundException;
import com.reon.backend.models.User;
import com.reon.backend.repositories.UserRepository;
import com.reon.backend.services.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(
        name = "endpoints for analytics purpose",
        path = "/api/analytics"
)
public class AnalyticsController {
    private final Logger log = LoggerFactory.getLogger(AnalyticsController.class);
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    public AnalyticsController(AnalyticsService analyticsService, UserRepository userRepository) {
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    @GetMapping(
            name = "endpoint to fetch analytics for specific shortUrl",
            path = "/link/{shortUrl}"
    )
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Analytics>> fetchLinkAnalytics(
            @PathVariable String shortUrl,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime to
            ) {
        log.info("AnalyticsController :: Fetching link analytics for shortUrl: {}", shortUrl);
        List<Analytics> analytics = analyticsService.getClicksAnalyticsForLink(shortUrl, from, to);
        log.info("AnalyticsController: Fetched link analytics: {}", analytics);
        return ResponseEntity.
                status(HttpStatus.FOUND)
                .body(analytics);
    }

    @GetMapping(
            name = "endpoint to display overall total link clicks",
            path = "/overallAnalytics"
    )
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<LocalDate, Long>> fetchOverallAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime to,
            Principal principal
    ) {
        log.info("AnalyticsController :: Fetching loggedIn user");
        User user = userRepository.findByEmail(principal.getName()).orElseThrow(
                () -> new UserNotFoundException("User not found with email: " + principal.getName())
        );
        log.info("AnalyticsController :: Fetching overall analytics for timeline - from: {}, to: {}", from, to);
        Map<LocalDate, Long> totalClicks = analyticsService.getClicksAnalyticsForUser(user, from, to);
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .body(totalClicks);
    }
}
