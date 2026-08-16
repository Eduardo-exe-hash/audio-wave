package com.example.audio_wave.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteId implements Serializable {

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "audio_id")
    private Long audioId;


    @Override
    public boolean equals(Object o){
        if (this == o) return true;
        if (o == null|| getClass() != o.getClass()) return true;
        FavoriteId that = (FavoriteId) o;
        return Objects.equals(userId,that.userId) && Objects.equals(audioId, that.audioId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId,audioId);
    }
}
