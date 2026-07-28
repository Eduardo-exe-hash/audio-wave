package com.example.audio_wave.backend.exception;

public class UsersNotFoundException extends RuntimeException {
    public UsersNotFoundException(String message) {
        super(message);
    }
}
