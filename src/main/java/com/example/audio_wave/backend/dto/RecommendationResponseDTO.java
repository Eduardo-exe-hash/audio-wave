package com.example.audio_wave.backend.dto;

public record RecommendationResponseDTO(
        String jamendoId,
        String musicTitle,
        String artistName,
        String albumName,
        Integer durationSeconds,
        String coverImageUrl
) {
}
