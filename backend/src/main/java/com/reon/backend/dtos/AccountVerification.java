package com.reon.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountVerification {
    @NotBlank(message = "Token of characters is required.")
    private String verificationCode;
}
