package com.example.audio_wave.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AddAudioToPlaylistDTO(
        @NotBlank(message = "Jamendo's id is required")
        String jamendoId,

        @NotBlank(message = "Music title is required")
        String musicTitle,

        String artistName,
        String albumName,
        String genre,

        @NotNull(message = "Duration music is required")
        Integer durationSeconds,

        @NotBlank(message = "The URL of audio is required")
        String audioUrl,

        String coverImageUrl
) {
}
