package com.example.audio_wave.backend.dto;

import com.example.audio_wave.backend.entity.Users;

import java.time.Instant;
import java.util.UUID;

public record UsersDTO (
     UUID id,
     String name,
     String email,
     Instant createdAt



){
    public UsersDTO(Users users){
        this(
        users.getId(),
        users.getName(),
        users.getEmail(),
        users.getCreatedAt()
        );
    }
}
