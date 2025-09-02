package com.reon.backend.services;

public interface EmailService {
    void sendWelcomeEmail(String recipient, String name);
    void sendVerificationTokenEmail(String recipient, String token, String name);
}
