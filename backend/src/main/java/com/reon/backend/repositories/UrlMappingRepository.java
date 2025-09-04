package com.reon.backend.repositories;

import com.reon.backend.models.UrlMapping;
import com.reon.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
    boolean existsByShortUrl(String shortUrl);
    Optional<UrlMapping> findByShortUrl(String shortUrl);

    List<UrlMapping> findByUser(User user);
}
