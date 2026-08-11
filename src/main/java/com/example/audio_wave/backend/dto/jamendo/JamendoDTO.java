package com.example.audio_wave.backend.dto.jamendo;

import com.fasterxml.jackson.annotation.JsonProperty;

public record JamendoDTO(
        String id,
        @JsonProperty("name")
        String titleMusic,
        @JsonProperty("duration")
        Integer durationSeconds,
        @JsonProperty("artist_name") String artistName,
        @JsonProperty("album_name") String albumName,
        @JsonProperty("image") String coverImageUrl
) {
}
