package com.example.audio_wave.backend.dto;

import com.example.audio_wave.backend.entity.Favorite;

import java.time.LocalDateTime;

public record FavoriteResponseDTO(
        Long audioId,
        String jamendoId,
        String musicTitle,
        String artistName,
        String albumName,
        String genre,
        Integer durationSeconds,
        String audioUrl,
        String coverImageUrl,
        LocalDateTime favoritedAt
) {
    public static FavoriteResponseDTO fromEntity(Favorite favorite){
        var audio = favorite.getAudioTrack();
        return new FavoriteResponseDTO(
                audio.getId(),
                audio.getJamendoId(),
                audio.getMusicTitle(),
                audio.getArtistName(),
                audio.getAlbumName(),
                audio.getGenre(),
                audio.getDurationSeconds(),
                audio.getAudioUrl(),
                audio.getCoverImage(),
                favorite.getFavoritedAt()
        );
    }
}
