package com.reon.backend.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    private final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> globalExceptionHandler(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleException(EmailAlreadyExistsException exception) {
        log.info("email exception: {}", exception.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("email", "User with this email already exists.");
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleException(UserNotFoundException exception) {
        log.info("user not found: {}", exception.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("message", "User not found.");
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleException(BadCredentialsException exception) {
        log.info(exception.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("credentials", "Provided credentials are incorrect.");
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<Map<String, String>> handleException(DisabledException exception) {
        log.info(exception.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("disabled", "Account is disabled. Contact your administrator.");
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ShortCodeException.class)
    public ResponseEntity<Map<String, String>> handleException(ShortCodeException exception) {
        log.info(exception.getMessage());
        Map<String, String> error = new HashMap<>();
        error.put("shortCode", "Short Url not found");
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
