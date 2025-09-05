package com.reon.backend.services;

import com.reon.backend.dtos.url.UrlRequest;
import com.reon.backend.dtos.url.UrlResponse;
import com.reon.backend.models.User;
import org.springframework.data.domain.Page;

public interface UrlMappingService {
    UrlResponse createShortUrl(UrlRequest urlRequest, User user);
    UrlResponse getOriginalUrl(String shortCode);
    Page<UrlResponse> viewAllUrls(int page, int size, User user);
}
