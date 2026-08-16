package com.example.audio_wave.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_favorite")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Favorite {

    @EmbeddedId
    private FavoriteId id;


    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("audioId")
    @JoinColumn(name = "audio_id")
    private AudioTrack audioTrack;

    @Column(name = "favorited_at", nullable = false, updatable = false)
    private LocalDateTime favoritedAt = LocalDateTime.now();

    public Favorite(Users users, AudioTrack audioTrack) {

        this.id = new FavoriteId(users.getId(), audioTrack.getId());
        this.users = users;
        this.audioTrack = audioTrack;
        this.favoritedAt = LocalDateTime.now();
    }
}
