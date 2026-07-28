package com.example.audio_wave.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsersCreateDTO(
        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email has must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "The password must be at least 8 chars long")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
                message = "\"Password must be: uppercase letters, lowcase, numbers and specials symbols\"")
        String password
) {
}
