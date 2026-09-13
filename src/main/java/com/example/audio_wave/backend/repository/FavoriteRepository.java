package com.example.audio_wave.backend.repository;

import com.example.audio_wave.backend.entity.Favorite;
import com.example.audio_wave.backend.entity.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {

    List<Favorite> findById_UserIdOrderByFavoritedAtDesc(UUID userId);

    boolean existsById_UserIdAndId_AudioId(UUID userId, Long audioId);
}
