package com.example.audio_wave.backend.dto;

public record ResetPasswordDTO(
        String token,

        String newPassword
) {
}
