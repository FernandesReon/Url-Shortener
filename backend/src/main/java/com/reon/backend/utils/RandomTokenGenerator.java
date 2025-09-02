package com.reon.backend.utils;

import java.security.SecureRandom;

public class RandomTokenGenerator {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int TOKEN_LENGTH = 6;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public static String generateToken() {
        StringBuilder token = new StringBuilder();
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            token.append(CHARACTERS.charAt(SECURE_RANDOM.nextInt(CHARACTERS.length())));
        }
        return token.toString();
    }
}
