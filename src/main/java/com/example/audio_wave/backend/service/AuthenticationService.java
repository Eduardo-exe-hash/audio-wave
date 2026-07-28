package com.example.audio_wave.backend.service;

import com.example.audio_wave.backend.dto.JwtResponse;
import com.example.audio_wave.backend.dto.LoginDTO;
import com.example.audio_wave.backend.dto.VerifyPasswordDTO;
import com.example.audio_wave.backend.entity.Users;
import com.example.audio_wave.backend.exception.EmailNotFoundException;
import com.example.audio_wave.backend.exception.InvalidPasswordException;
import com.example.audio_wave.backend.exception.InvalidTokenException;
import com.example.audio_wave.backend.exception.UsersNotFoundException;
import com.example.audio_wave.backend.repository.UsersRepository;
import com.example.audio_wave.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements UserDetailsService {

    private static final long TOKEN_EXPIRATION_MINUTES = 30;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private JwtService jwtService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usersRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    public JwtResponse login(LoginDTO data){
        Users users = usersRepository.findByEmail(data.email())
                .orElseThrow(() -> new EmailNotFoundException("Email not found!"));
        if (!passwordEncoder.matches(data.password(), users.getPassword())){
            throw new InvalidPasswordException("Invalid password");
        }
        String token = jwtService.generateToken(users);
        return new JwtResponse(token);
    }

    @Transactional(readOnly = true)
    public void verifyPassword(VerifyPasswordDTO data){
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail;
        
        if (principal instanceof UserDetails){
            userEmail = ((UserDetails) principal).getUsername();
        } else if (principal instanceof Users) {
            userEmail = ((Users) principal).getUsername();
        } else if (principal instanceof String) {
            userEmail = (String) principal;
        } else {
            System.err.println("Unknown type of principal" + principal.getClass().getName());
            throw new RuntimeException("Cannot find user data!");
        }

        Users currentUser = usersRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsersNotFoundException("Auth user ["+userEmail+"] not found"));
        if (!passwordEncoder.matches(data.password(), currentUser.getPassword())){
            throw new InvalidPasswordException("Current password's incorret");
        }
    }

    public void resetPassword(String email){
        Users users = usersRepository.findByEmail(email).orElse(null);

        if (users != null){
            String resetToken = UUID.randomUUID().toString();
            Instant expiryDate = Instant.now().plus(TOKEN_EXPIRATION_MINUTES, java.time.temporal.ChronoUnit.MINUTES);

            users.setResetToken(resetToken);
            users.setResetTokenExpiry(expiryDate);
            usersRepository.save(users);
        } else {
            System.out.println("Reset has failed! Try again!");
        }
    }
    public void tokenValidReset(String token){
        Users users = usersRepository.findByResetToken(token)
                .orElseThrow(() -> new InvalidTokenException("Reset token invalid"));
        if (users.getResetTokenExpiry().isBefore(Instant.now())){
            users.setResetToken(null);
            users.setResetTokenExpiry(null);
            usersRepository.save(users);
            throw new InvalidTokenException("Reset token has expired");
        }
    }

    @Transactional
    public void resetPasswordDone(String token, String newPassword) {
        Users users = usersRepository.findByResetToken(token)
                .orElseThrow(() -> new InvalidTokenException("Reset token invalid"));

        if (users.getResetTokenExpiry().isBefore(Instant.now())) {
            users.setResetToken(null);
            users.setResetTokenExpiry(null);
            usersRepository.save(users);
            throw new InvalidTokenException("Reset token has expired");
        }
        users.setPassword(passwordEncoder.encode(newPassword));
        users.setResetToken(null);
        users.setResetTokenExpiry(null);
        usersRepository.save(users);
    }
}
