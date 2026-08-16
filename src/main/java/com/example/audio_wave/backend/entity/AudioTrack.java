package com.example.audio_wave.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_audio")
public class AudioTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String jamendoId;

    @Column(nullable = false)
    private String musicTitle;

    private String artistName;
    private String albumName;
    private Integer durationSeconds;
    private String audioUrl;
    private String coverImage;

    private LocalDateTime createdAt = LocalDateTime.now();

}
