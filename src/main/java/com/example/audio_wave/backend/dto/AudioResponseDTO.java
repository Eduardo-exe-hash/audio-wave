package com.example.audio_wave.backend.dto;

public record AudioResponseDTO(
        Long id,
        String jamendoId,
        String musicTitle,
        String artistName,
        String albumName,
        Integer durationSeconds,
        String audioUrl,
        String coverImageUrl

) {
}
