package com.example.audio_wave.backend.dto;

import jakarta.validation.constraints.Email;

public record UsersUpdateResponseDTO(
        String name,

        @Email
        String email,

        String currentPassword,

        String updatedPassword
) {

}
