package com.reon.backend.dtos.url;

import com.reon.backend.dtos.analytics.ClickEventResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UrlResponse {
    private Long id;
    private String longUrl;
    private String shortUrl;
    private long clickedCounts;
    private LocalDateTime createdOn;
    private boolean isActive;
    private String userId;
    // not exposing complete entity -- if done so will create infinity looping.
    private List<ClickEventResponse> clickEvents;
}
