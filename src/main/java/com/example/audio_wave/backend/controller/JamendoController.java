package com.example.audio_wave.backend.controller;

import com.example.audio_wave.backend.dto.jamendo.JamendoDTO;
import com.example.audio_wave.backend.service.JamendoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/music")
public class JamendoController {

    @Autowired
    private JamendoService jamendoService;

    @GetMapping("/search")
    public ResponseEntity<List<JamendoDTO>> searchTracks(
            @RequestParam String query,
            @RequestParam(name = "limit", defaultValue = "10") int limit
            ){
        List <JamendoDTO> tracks = jamendoService.searchTrack(query, limit);
        return ResponseEntity.ok(tracks);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<JamendoDTO>> getTracks(
            @RequestParam(name = "limit", defaultValue = "10") int limit
    ){
        List <JamendoDTO> tracks = jamendoService.getTracks(limit);
        return ResponseEntity.ok(tracks);
    }

    @GetMapping("/stream/{jamendoId}")
    public ResponseEntity<Void> streamTrack(@PathVariable String jamendoId) {
        String audioStreamUrl = jamendoService.getAudioUrlByJamendoId(jamendoId);

        if (audioStreamUrl == null || audioStreamUrl.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(audioStreamUrl))
                .build();
    }
}
