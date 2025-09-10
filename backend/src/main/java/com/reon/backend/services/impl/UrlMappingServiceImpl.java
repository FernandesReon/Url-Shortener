package com.reon.backend.services.impl;

import com.reon.backend.dtos.url.UrlRequest;
import com.reon.backend.dtos.url.UrlResponse;
import com.reon.backend.exceptions.ShortCodeException;
import com.reon.backend.mappers.UrlMapper;
import com.reon.backend.models.ClickEvent;
import com.reon.backend.models.UrlMapping;
import com.reon.backend.models.User;
import com.reon.backend.repositories.ClickEventRepository;
import com.reon.backend.repositories.UrlMappingRepository;
import com.reon.backend.services.UrlMappingService;
import com.reon.backend.utils.Base62Encoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UrlMappingServiceImpl implements UrlMappingService {
    private final Logger log = LoggerFactory.getLogger(UrlMappingServiceImpl.class);
    private final UrlMappingRepository urlMappingRepository;
    private final ClickEventRepository eventRepository;

    @Value("${app.base_url}")
    private String baseUrl;

    public UrlMappingServiceImpl(UrlMappingRepository urlMappingRepository, ClickEventRepository eventRepository) {
        this.urlMappingRepository = urlMappingRepository;
        this.eventRepository = eventRepository;
    }

    // TODO :: later include analytics

    @Override
    public UrlResponse createShortUrl(UrlRequest urlRequest, User user) {
        log.info("Url Mapping Service :: Creating short url for user: {}, url: {}", user.getName(), urlRequest.getLongUrl());

        UrlMapping mapping = UrlMapper.mapToEntity(urlRequest);
        mapping.setActive(true);
        mapping.setUser(user);
        mapping = urlMappingRepository.save(mapping);

        String shortCode = Base62Encoder.encode(mapping.getId());
        mapping.setShortUrl(shortCode);

        urlMappingRepository.save(mapping);

        log.info("Url Mapping Service :: Short url created for user: {}, longUrl: {}, shortUrl: {}", user.getName(), urlRequest.getLongUrl(), shortCode);
        UrlResponse response = UrlMapper.responseToUser(mapping);
        response.setShortUrl(baseUrl + "/" + shortCode);
        return response;
    }

    @Override
    public UrlResponse getOriginalUrl(String shortCode) {
        log.info("Url Mapping Service :: Fetching original url for shortCode: {}", shortCode);

        UrlMapping mapping = urlMappingRepository.findByShortUrl(shortCode).orElseThrow(
                () -> new ShortCodeException("Short Url not found: " + shortCode)
        );

        if (!mapping.isActive()) {
            log.warn("Url Mapping Service :: Short Url expired or inactive: {}", shortCode);
            throw new ShortCodeException("Short Url expired or inactive: " + shortCode );
        }

        mapping.setClickedCounts(mapping.getClickedCounts() + 1);
        urlMappingRepository.save(mapping);

        log.info("Url Mapping Service :: Redirecting shortCode: {} -> {}", shortCode, mapping.getLongUrl());

        ClickEvent event = new ClickEvent();
        event.setUrlMapping(mapping);
        eventRepository.save(event);

        UrlResponse response = UrlMapper.responseToUser(mapping);
        response.setShortUrl(baseUrl + "/" + shortCode);
        return response;
    }

    @Override
    public Page<UrlResponse> viewAllUrls(int page, int size, User user) {
        log.info("Url Mapping Service :: Fetching urls for page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<UrlMapping> mappings = urlMappingRepository.findByUser(user, pageable);

        return mappings.map(mapping -> {
            UrlResponse response = UrlMapper.responseToUser(mapping);
            response.setShortUrl(baseUrl + "/" + response.getShortUrl());
            return response;
        });
    }
}
