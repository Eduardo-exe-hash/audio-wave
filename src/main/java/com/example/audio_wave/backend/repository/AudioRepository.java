package com.example.audio_wave.backend.repository;

import com.example.audio_wave.backend.entity.AudioTrack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AudioRepository extends JpaRepository<AudioTrack, Long> {
    Optional<AudioTrack> findByJamendoId(String jamendoId);
}
