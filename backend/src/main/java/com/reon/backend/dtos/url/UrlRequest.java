package com.reon.backend.dtos.url;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UrlRequest {
    @NotBlank(message = "Original Url is required.")
    @URL(message = "Invalid Url format.")
    private String longUrl;
}
