package com.reon.backend.controllers;

import com.reon.backend.dtos.AccountVerification;
import com.reon.backend.services.OtpService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(
        name = "Otp related endpoints (account verification, reset password)",
        path = "/api/otp"
)
public class OTPController {
    private final Logger log = LoggerFactory.getLogger(OTPController.class);
    private final OtpService otpService;

    public OTPController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping(
            name = "Account verification",
            path = "/verifyAccount"
    )
    public ResponseEntity<String> verifyAccount(@RequestParam String email,
                                                @Valid @RequestBody AccountVerification accountVerification) {
        log.info("OTP Controller:: Verifying account {}", accountVerification);
        otpService.verifyAccount(email, accountVerification.getVerificationCode());
        log.info("OTP Controller:: Account verified.");
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Account verified.");
    }

    @PostMapping(
            name = "Resend account verification code",
            path = "/resendCode"
    )
    public ResponseEntity<String> resendVerificationCode(@RequestParam String email) {
        log.info("OTP Controller:: Resending verification code {}", email);
        otpService.sendVerificationTokenEmail(email);
        log.info("OTP Controller:: Verification code resent.");
        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Verification code sent.");
    }
}
