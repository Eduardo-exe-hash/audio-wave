package com.example.audio_wave.backend.dto;

import com.example.audio_wave.backend.enums.UserRole;

public record RegisterDTO(String email, String password, UserRole role) {
}
