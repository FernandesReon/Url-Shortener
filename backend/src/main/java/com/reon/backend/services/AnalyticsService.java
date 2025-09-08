package com.reon.backend.services;

import com.reon.backend.dtos.analytics.Analytics;
import com.reon.backend.models.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    List<Analytics> getClicksAnalyticsForLink(String shortUrl, LocalDateTime from, LocalDateTime to);
    Map<LocalDate, Long> getClicksAnalyticsForUser(User user, LocalDateTime from, LocalDateTime to);
}
