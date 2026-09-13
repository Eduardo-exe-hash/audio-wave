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
public class RecommendationService {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private JamendoService jamendoService;

    public List<RecommendationResponseDTO> getRecommendationsForUser(UUID userId){
        List<FavoriteResponseDTO> userFavorites = favoriteService.getUserFavorites(userId);

        Set<String> favoritedJamendoIds = userFavorites.stream()
                .map(FavoriteResponseDTO::jamendoId)
                .collect(Collectors.toSet());

        List<RecommendationResponseDTO> rawRecommendations;

        if (userFavorites.isEmpty()){
            rawRecommendations = jamendoService.getPopularTracks(10);
        } else {
            String baseArtistName = userFavorites.get(0).artistName();

            rawRecommendations = jamendoService.getTracksByArtistName(baseArtistName,10);

            if (rawRecommendations.isEmpty()){
                rawRecommendations =jamendoService.getPopularTracks(10);
            }
        }

        return rawRecommendations.stream()
                .filter(rec -> !favoritedJamendoIds.contains(rec.jamendoId()))
                .toList();
    }
}
