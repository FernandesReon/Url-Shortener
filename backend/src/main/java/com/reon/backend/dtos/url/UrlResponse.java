package com.reon.backend.dtos.url;

import com.reon.backend.models.ClickEvent;
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
    private List<ClickEvent> clickEvents;
}
