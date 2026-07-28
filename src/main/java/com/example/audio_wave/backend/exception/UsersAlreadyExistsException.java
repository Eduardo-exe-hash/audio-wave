package com.example.audio_wave.backend.exception;

public class UsersAlreadyExistsException extends RuntimeException {
    public UsersAlreadyExistsException(String message) {
        super(message);
    }
}
