package com.example.audio_wave.backend.repository;

import com.example.audio_wave.backend.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlaylistsRepository extends JpaRepository<Playlist,Long> {
    List<Playlist> findByUsersId(UUID usersId);
    List<Playlist> findByIsPublicTrue();
}
