package com.example.audio_wave.backend.service;

import com.example.audio_wave.backend.dto.RecommendationResponseDTO;
import com.example.audio_wave.backend.dto.jamendo.JamendoDTO;
import com.example.audio_wave.backend.dto.jamendo.JamendoResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;

@Service
public class JamendoService {

    @Autowired
    private WebClient jamendoWebClient;

    @Value("${jamendo.api.client-id}")
    private String clientId;

    public List<JamendoDTO> searchTrack(String query, int limit){
        JamendoResponseDTO<JamendoDTO> response = jamendoWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tracks")
                        .queryParam("client_id", clientId)
                        .queryParam("format", "json")
                        .queryParam("search", query)
                        .queryParam("limit",limit)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<JamendoResponseDTO<JamendoDTO>>(){})
                .block();
        return response != null ? response.results(): Collections.emptyList();
    }

    public List<JamendoDTO> getTracks(int limit){
        JamendoResponseDTO<JamendoDTO> response = jamendoWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tracks")
                        .queryParam("client_id",clientId)
                        .queryParam("format", "json")
                        .queryParam("order", "popularity_week")
                        .queryParam("limit",limit)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<JamendoResponseDTO<JamendoDTO>>(){})
                .block();
        return response != null ? response.results(): Collections.emptyList();
    }

    public List<RecommendationResponseDTO> getPopularTracks(int limit) {
        List<JamendoDTO> tracks = getTracks(limit);
        return mapToRecommendationDTOList(tracks);
    }

    public List<RecommendationResponseDTO> getTracksByArtistName(String baseArtistName, int limit) {
        JamendoResponseDTO<JamendoDTO> response = jamendoWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/tracks")
                        .queryParam("client_id", clientId)
                        .queryParam("format", "json")
                        .queryParam("artist_name", baseArtistName)
                        .queryParam("order", "popularity_month")
                        .queryParam("limit", limit)
                        .build())
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<JamendoResponseDTO<JamendoDTO>>() {
                })
                .block();

        List<JamendoDTO> tracks = response != null ? response.results() : Collections.emptyList();
        return mapToRecommendationDTOList(tracks);
    }
        public List<RecommendationResponseDTO> getTracksByTag(String tag, int limit) {
            if (tag == null || tag.isBlank()){
                return getPopularTracks(limit);
            }

            String cleanTag = tag.trim().toLowerCase();
                JamendoResponseDTO<JamendoDTO> response = jamendoWebClient.get()
                        .uri(uriBuilder -> uriBuilder
                            .path("/tracks")
                            .queryParam("client_id",clientId)
                            .queryParam("format", "json")
                            .queryParam("fuzzytags",cleanTag)
                            .queryParam("order", "popularity_month")
                            .queryParam("limit", limit)
                            .build())
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<JamendoResponseDTO<JamendoDTO>>(){})
                    .block();

            List<JamendoDTO> tracks = response != null ? response.results() : Collections.emptyList();
            return mapToRecommendationDTOList(tracks);
    }

    private List<RecommendationResponseDTO> mapToRecommendationDTOList(List<JamendoDTO> jamendoDTOs){
        if (jamendoDTOs == null || jamendoDTOs.isEmpty()){
            return Collections.emptyList();
        }

        return jamendoDTOs.stream()
                .map(track -> new RecommendationResponseDTO(
                        track.id(),
                        track.titleMusic(),
                        track.artistName(),
                        track.albumName(),
                        track.durationSeconds(),
                        track.coverImageUrl()
                ))
                .toList();
    }
}
