package com.reon.backend.utils;

public class Base62Encoder {
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int BASE = CHARACTERS.length();

    public static void main(String[] args) {
        System.out.println(BASE);
    }

    public static String encode(long input) {
        StringBuilder output = new StringBuilder();
        while (input != 0) {
            output.append(CHARACTERS.charAt((int) (input % BASE)));
            input /= BASE;
        }
        return output.reverse().toString();
    }
}
