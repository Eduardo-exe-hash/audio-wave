package com.example.audio_wave.backend.controller;

import com.example.audio_wave.backend.dto.*;
import com.example.audio_wave.backend.entity.Users;
import com.example.audio_wave.backend.exception.InvalidTokenException;
import com.example.audio_wave.backend.repository.UsersRepository;
import com.example.audio_wave.backend.security.JwtService;
import com.example.audio_wave.backend.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = jwtService.generateToken((Users) auth.getPrincipal());
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordDTO data){
        authenticationService.resetPassword(data.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> verifyPassword(@Valid @RequestBody VerifyPasswordDTO data){
        authenticationService.verifyPassword(data);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity resetPassword(@RequestBody @Valid ResetPasswordDTO data) {
        authenticationService.resetPasswordDone(data.token(), data.newPassword());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reset-password")
    public ResponseEntity<String> verifyResetToken(@RequestParam("token") String token) {
        try {
            authenticationService.tokenValidReset(token);
            return ResponseEntity.ok("Your token is valid,now you can proceed reseting your password");
        } catch (InvalidTokenException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data){
        if(this.usersRepository.findByEmail(data.email()) != null) return ResponseEntity.badRequest().build();
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        Users newUsers = new Users(data.email(), encryptedPassword, data.role());

        this.usersRepository.save(newUsers);

        return ResponseEntity.ok().build();
    }
}
