package com.example.audio_wave.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PlaylistRequestDTO(
        @NotBlank(message = "Playlist name's required")
        String namePlaylist,

        String description,

        @NotNull(message = "Visibility is required")
        Boolean isPublic,

        @NotNull(message = "URL image of album is required")
        String coverImageUrl
) {
}
