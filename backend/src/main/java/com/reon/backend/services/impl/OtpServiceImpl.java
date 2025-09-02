package com.reon.backend.services.impl;

import com.reon.backend.exceptions.InvalidOTPException;
import com.reon.backend.exceptions.OTPExpiredException;
import com.reon.backend.exceptions.UserNotFoundException;
import com.reon.backend.models.User;
import com.reon.backend.models.VerificationToken;
import com.reon.backend.repositories.UserRepository;
import com.reon.backend.services.EmailService;
import com.reon.backend.services.OtpService;
import com.reon.backend.utils.RandomTokenGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class OtpServiceImpl implements OtpService {
    private final Logger log = LoggerFactory.getLogger(OtpServiceImpl.class);
    private final EmailService emailService;
    private final UserRepository userRepository;

    public OtpServiceImpl(EmailService emailService, UserRepository userRepository) {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @Override
    public void sendVerificationTokenEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email " + email + " not found")
        );

        // new object of verification token class
        VerificationToken verificationToken = new VerificationToken();

        // generate an otp and set it.
        String token = RandomTokenGenerator.generateToken();
        verificationToken.setToken(token);

        // set the expiration time for otp and set it.
        long tokenExpiryTime = System.currentTimeMillis() + (10 * 60 * 1000);
        verificationToken.setExpiryTime(tokenExpiryTime);

        // set these details for the user
        verificationToken.setUser(user);
        user.setToken(verificationToken);

        // save to database
        userRepository.save(user);

        // send email
        emailService.sendVerificationTokenEmail(email, token, user.getName());
    }

    @Override
    public void verifyAccount(String email, String token) {
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User with email " + email + " not found")
        );

        VerificationToken verifyToken = user.getToken();

        if (!verifyToken.getToken().equals(token)) {
            throw new InvalidOTPException("Provided OTP is invalid.");
        }

        if (verifyToken.getExpiryTime() < System.currentTimeMillis()) {
            throw new OTPExpiredException("OTP has expired.");
        }

        user.setEmailVerified(true);
        user.setAccountEnabled(true);

        verifyToken.setToken(null);
        verifyToken.setExpiryTime(0L);

        userRepository.save(user);

        emailService.sendWelcomeEmail(email, user.getName());
    }
}
