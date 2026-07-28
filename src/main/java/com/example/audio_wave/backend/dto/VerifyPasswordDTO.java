package com.example.audio_wave.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyPasswordDTO(
        @NotBlank(message = "The password is ")
        String password
) {
}
