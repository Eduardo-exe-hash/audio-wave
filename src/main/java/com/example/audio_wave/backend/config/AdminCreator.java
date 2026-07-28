package com.example.audio_wave.backend.config;

import com.example.audio_wave.backend.entity.Users;
import com.example.audio_wave.backend.enums.UserRole;
import com.example.audio_wave.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class AdminCreator implements CommandLineRunner {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.name}")
    private String adminName;

    public AdminCreator(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if(!usersRepository.existsByEmail(adminEmail)){
            Users adminUser = new Users();
            adminUser.setName(adminName);
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRole(UserRole.ADMIN);
            usersRepository.save(adminUser);
            System.out.println("Administrator CREATED succefully with e-mail: " + adminEmail);
        } else {
            System.out.println("Administrator ALREADY EXISTS with e-mail: " + adminEmail);
        }
    }
}
