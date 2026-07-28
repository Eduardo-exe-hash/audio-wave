package com.example.audio_wave.backend.controller;


import com.example.audio_wave.backend.dto.UsersCreateDTO;
import com.example.audio_wave.backend.dto.UsersUpdateResponseDTO;
import com.example.audio_wave.backend.dto.UsersDTO;
import com.example.audio_wave.backend.service.UsersService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UsersController {

    private final UsersService usersService;

    @PostMapping
    @PreAuthorize("permitAll()")
    public ResponseEntity<UsersDTO> createUser(@RequestBody @Valid UsersCreateDTO data) {
        UsersDTO createdUser = usersService.createUser(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> getAllUsers() {
        List<String> users = usersService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UsersDTO> getUserById(@PathVariable UUID id) {
        UsersDTO users = usersService.getUserById(id);
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsersDTO> updateUser(@PathVariable UUID id, @Valid @RequestBody UsersUpdateResponseDTO data) {
        UsersDTO response = usersService.updateUser(id, data);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        usersService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteMyAccount(Principal principal) {
        UsersDTO users = usersService.getUserByEmail(principal.getName());
        usersService.deleteUser(users.id());
        return ResponseEntity.noContent().build();
    }
}