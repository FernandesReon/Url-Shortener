package com.reon.backend.exceptions;

public class InvalidOTPException extends RuntimeException {
    public InvalidOTPException(String message) {
        super(message);
    }
}
