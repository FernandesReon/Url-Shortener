package com.reon.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "url_info")
public class UrlMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String longUrl;

    @Column(nullable = false, unique = true)
    private String shortUrl;

    @Column
    private String customAlias;
    private long clickedCounts = 0;

    @Column(nullable = false)
    private LocalDateTime createdOn;

    @Column
    private LocalDateTime expiryDate = null;

    @Column(nullable = false)
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "urlMapping", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ClickEvent> clickEvents;
}
