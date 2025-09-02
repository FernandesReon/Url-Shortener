package com.reon.backend.exceptions;

public class OTPExpiredException extends RuntimeException {
    public OTPExpiredException(String message) {
        super(message);
    }
}
