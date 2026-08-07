package com.example.audio_wave.backend.dto.jamendo;

import java.util.List;

public record JamendoResponseDTO<T>(
        List<T> results
) {
}
