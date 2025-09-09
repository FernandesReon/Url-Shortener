package com.reon.backend.mappers;

import com.reon.backend.dtos.analytics.ClickEventResponse;
import com.reon.backend.dtos.url.UrlRequest;
import com.reon.backend.dtos.url.UrlResponse;
import com.reon.backend.models.UrlMapping;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UrlMapper {
    // incoming data from client saved in database
    // frontend -- server -- database
    public static UrlMapping mapToEntity(UrlRequest urlRequest) {
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setLongUrl(urlRequest.getLongUrl());
        return urlMapping;
    }

    // outgoing data from database to client
    // database -- server -- frontend
    public static UrlResponse responseToUser(UrlMapping urlMapping) {
        UrlResponse response = new UrlResponse();
        response.setId(urlMapping.getId());
        response.setLongUrl(urlMapping.getLongUrl());
        response.setShortUrl(urlMapping.getShortUrl());
        response.setClickedCounts(urlMapping.getClickedCounts());
        response.setCreatedOn(urlMapping.getCreatedOn());
        response.setActive(urlMapping.isActive());

        if (urlMapping.getUser() != null) {
            response.setUserId(urlMapping.getUser().getId());
        }

        // to avoid recursive behavior
        if (urlMapping.getClickEvents() != null) {
            response.setClickEvents(urlMapping.getClickEvents().stream()
                    .map(event -> new ClickEventResponse(
                            event.getId(), event.getTimestamp()
                    ))
                    .collect(Collectors.toList()));
        }

        return response;
    }
}
