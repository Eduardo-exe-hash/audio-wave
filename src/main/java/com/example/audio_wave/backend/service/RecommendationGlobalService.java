package com.example.audio_wave.backend.service;

import com.example.audio_wave.backend.dto.FavoriteResponseDTO;
import com.example.audio_wave.backend.dto.RecommendationResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RecommendationGlobalService {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private JamendoService jamendoService;

    public List<RecommendationResponseDTO> getGlobalRecommendations(UUID userId) {
        List<FavoriteResponseDTO> userFavorites = favoriteService.getUserFavorites(userId);

        Set<String> favoritedJamendoIds = userFavorites.stream()
                .map(FavoriteResponseDTO::jamendoId)
                .collect(Collectors.toSet());

        List<RecommendationResponseDTO> rawRecommendations;

        if (userFavorites.isEmpty()) {
            rawRecommendations = jamendoService.getPopularTracks(10);
        } else {
            String preferredGenre = extractGenreOrQuery(userFavorites.get(0));
            rawRecommendations = jamendoService.getTracksByArtistName(preferredGenre, 10);

            if (rawRecommendations.isEmpty()) {
                rawRecommendations = jamendoService.getPopularTracks(10);
            }
        }

        List<RecommendationResponseDTO> filtered = rawRecommendations.stream()
                .filter(rec -> !favoritedJamendoIds.contains(rec.jamendoId()))
                .toList();
        if (filtered.isEmpty()){
            return jamendoService.getPopularTracks(15);
        }

        return rawRecommendations.stream()
                .filter(rec -> !favoritedJamendoIds.contains(rec.jamendoId()))
                .toList();
    }

    private String extractGenreOrQuery(FavoriteResponseDTO favorite) {
        if (favorite.genre() != null && !favorite.genre().isBlank()) {
            return favorite.genre().toLowerCase().trim();
        }
        return favorite.genre();
    }
}

