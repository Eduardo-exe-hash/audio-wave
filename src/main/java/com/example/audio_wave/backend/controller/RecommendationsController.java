package com.example.audio_wave.backend.controller;

import com.example.audio_wave.backend.dto.RecommendationResponseDTO;
import com.example.audio_wave.backend.entity.Users;
import com.example.audio_wave.backend.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
public class RecommendationsController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<List<RecommendationResponseDTO>> getRecommendations(@AuthenticationPrincipal Users users){
        List<RecommendationResponseDTO> recommendation = recommendationService.getRecommendationsForUser(users.getId());
        return ResponseEntity.ok(recommendation);
    }

}
