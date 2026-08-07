package com.example.audio_wave.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PlaylistResponseDTO(
        Long id,
        String namePlaylist,
        String description,
        Boolean isPublic,
        String coverImageUrl,
        LocalDateTime createdAt,
        java.util.UUID userId,
        String usersEmail,
        List<AudioResponseDTO> audios
) {
}
