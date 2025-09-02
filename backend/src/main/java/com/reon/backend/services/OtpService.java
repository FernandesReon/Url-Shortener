package com.reon.backend.services;

public interface OtpService {
    void sendVerificationTokenEmail(String email);
    void verifyAccount(String email, String token);
}
