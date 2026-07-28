package com.example.audio_wave.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginDTO(
        @NotBlank
        String email,
        @NotBlank
        String password
) {
}
