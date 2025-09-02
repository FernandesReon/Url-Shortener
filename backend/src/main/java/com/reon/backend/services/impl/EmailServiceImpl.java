package com.reon.backend.services.impl;

import com.reon.backend.services.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    @Value("${email.sender}")
    private String emailSender;

    private final JavaMailSender mailSender;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendWelcomeEmail(String recipient, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailSender);
        message.setTo(recipient);
        message.setSubject("Welcome to Brief.ly " + name);
        message.setText("Hello " + name + " !,\n" +
                "Welcome aboard!\n\n" +
                "You've successfully joined the Brief.ly - a magical URL Shortener.\n" +
                "Need help getting started? Feel free to ask us about it.\n\n" +
                "Best,\n" +
                "Brief.ly Team"
        );
        mailSender.send(message);
    }

    @Override
    public void sendVerificationTokenEmail(String recipient, String token, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(emailSender);
        message.setTo(recipient);
        message.setSubject("Verification Token from Brief.ly");
        message.setText(
                "Hello, " + name + "\n\n" +
                        "To complete your signup, please use the following token: " + token + "\n" +
                        "Token is valid for 10 minutes only." +
                        "If not requested this, please disregard this email.\n\n" +
                        "Brief.ly Team"
        );
        mailSender.send(message);
    }
}
