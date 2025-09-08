package com.reon.backend.services.impl;

import com.reon.backend.dtos.analytics.Analytics;
import com.reon.backend.exceptions.ShortCodeException;
import com.reon.backend.models.ClickEvent;
import com.reon.backend.models.UrlMapping;
import com.reon.backend.models.User;
import com.reon.backend.repositories.ClickEventRepository;
import com.reon.backend.repositories.UrlMappingRepository;
import com.reon.backend.services.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {
    private final Logger log = LoggerFactory.getLogger(AnalyticsServiceImpl.class);

    private final ClickEventRepository clickEventRepository;
    private final UrlMappingRepository urlMappingRepository;

    public AnalyticsServiceImpl(ClickEventRepository clickEventRepository, UrlMappingRepository urlMappingRepository) {
        this.clickEventRepository = clickEventRepository;
        this.urlMappingRepository = urlMappingRepository;
    }

    // individual short url
    @Override
    public List<Analytics> getClicksAnalyticsForLink(String shortUrl, LocalDateTime from, LocalDateTime to) {
        log.info("AnalyticsService :: Checking for short url: {}", shortUrl);
        UrlMapping mapping = urlMappingRepository.findByShortUrl(shortUrl).orElseThrow(
                () -> new ShortCodeException("Mapping not found for shortUrl: " + shortUrl)
        );

        List<ClickEvent> events = clickEventRepository.findByUrlMappingAndTimestampBetween(mapping, from, to);

        return events.stream()
                .collect(Collectors.groupingBy(
                        event -> event.getTimestamp().toLocalDate(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> new Analytics(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // main graph
    @Override
    public Map<LocalDate, Long> getClicksAnalyticsForUser(User user, LocalDateTime from, LocalDateTime to) {
        log.info("AnalyticsService :: Fetching all shortUrl counts for user: {}, from: {}, to:{}", user, from, to);
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingInAndTimestampBetween(urlMappings, from, to);
        return clickEvents.stream()
                .collect(Collectors.groupingBy(
                        clicks -> clicks.getTimestamp().toLocalDate(),
                        Collectors.counting()
                ));
    }
}
