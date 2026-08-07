package com.example.audio_wave.backend.controller;

import com.example.audio_wave.backend.dto.AddAudioToPlaylistDTO;
import com.example.audio_wave.backend.dto.AudioResponseDTO;
import com.example.audio_wave.backend.dto.PlaylistRequestDTO;
import com.example.audio_wave.backend.dto.PlaylistResponseDTO;
import com.example.audio_wave.backend.service.PlaylistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/playlists")
@PreAuthorize("isAuthenticated()")
public class PlaylistsController {

    @Autowired
    PlaylistService playlistService;

    @PostMapping
    public ResponseEntity<PlaylistResponseDTO> createPlaylist(
            @RequestBody @Valid PlaylistRequestDTO dto
            ,Authentication authentication)
    {
        String userEmail = authentication.getName();
        PlaylistResponseDTO response = playlistService.createPlaylist(dto,userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<PlaylistResponseDTO>> getUsersPlaylist(Authentication authentication){
        String userEmail = authentication.getName();
        List<PlaylistResponseDTO> playlists = playlistService.getUsersPlaylist(userEmail);
        return ResponseEntity.ok(playlists);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaylistResponseDTO> getPlaylistsId(@PathVariable Long id){
        PlaylistResponseDTO playlist = playlistService.getPlaylistsId(id);
        return ResponseEntity.ok(playlist);
    }

    @PostMapping("/{id}/audios")
    public ResponseEntity<PlaylistResponseDTO> addAudioToPlaylist(
            @PathVariable Long id,
            @RequestBody @Valid AddAudioToPlaylistDTO dto,
            Authentication authentication){

        String userEmail = authentication.getName();
        PlaylistResponseDTO updatedPlaylist = playlistService.addAudioToPlaylist(id,dto,userEmail);
        return ResponseEntity.ok(updatedPlaylist);
    }

    @DeleteMapping("/{playlistId}/audios/{audioId}")
    public ResponseEntity<PlaylistResponseDTO> removeAudioFromPlaylist(
            @PathVariable Long playlistId,
            @PathVariable Long audioId,
            Authentication authentication
    ){
        String userEmail = authentication.getName();
        PlaylistResponseDTO updatedPlaylist = playlistService.removeAudioFromPlaylist(playlistId,audioId, userEmail);
        return ResponseEntity.ok(updatedPlaylist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylist(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        playlistService.deleteFromPlaylists(id,userEmail);
        return ResponseEntity.noContent().build();
    }
}
