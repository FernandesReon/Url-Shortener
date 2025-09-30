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

    // TODO :: later include custom alias for premium users, expiration time.

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String longUrl;

    @Column(unique = true)
    private String shortUrl;

    private long clickedCounts = 0;

    @Column(nullable = false)
    private LocalDateTime createdOn;

    @Column
    private boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "urlMapping", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ClickEvent> clickEvents;

    @PrePersist
    public void prePersist() {
        this.createdOn = LocalDateTime.now();
    }
}
