package com.example.audio_wave.backend.repository;


import com.example.audio_wave.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, UUID> {

    Optional<Users> findUserByEmail(String email);
    UserDetails findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<Users> findByResetToken(String token);
}
