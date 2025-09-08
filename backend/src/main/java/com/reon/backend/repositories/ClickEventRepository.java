package com.reon.backend.repositories;

import com.reon.backend.models.ClickEvent;
import com.reon.backend.models.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {
    // for individual short link
    List<ClickEvent> findByUrlMappingAndTimestampBetween(UrlMapping urlMapping, LocalDateTime from, LocalDateTime to);

    // for overall short links
    List<ClickEvent> findByUrlMappingInAndTimestampBetween(List<UrlMapping> urlMappingList, LocalDateTime from, LocalDateTime to);
}
