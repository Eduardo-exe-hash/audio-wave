package com.example.audio_wave.backend.controller;

import com.example.audio_wave.backend.dto.AddAudioToPlaylistDTO;
import com.example.audio_wave.backend.dto.FavoriteResponseDTO;
import com.example.audio_wave.backend.entity.Users;
import com.example.audio_wave.backend.service.FavoriteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<FavoriteResponseDTO> addFavorite(
            @AuthenticationPrincipal Users users,
            @RequestBody @Valid AddAudioToPlaylistDTO dto){

        FavoriteResponseDTO response = favoriteService.addFavorite(users.getId(),dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{audioId}")
    public ResponseEntity<Void> removeFavorite(
            @AuthenticationPrincipal Users users,
            @PathVariable Long audioId){

        favoriteService.removeFromFavorite(users.getId(),audioId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponseDTO>> getUserFavorites(
            @AuthenticationPrincipal Users users){

        List<FavoriteResponseDTO> favorites = favoriteService.getUserFavorites(users.getId());
        return ResponseEntity.ok(favorites);
    }
}
