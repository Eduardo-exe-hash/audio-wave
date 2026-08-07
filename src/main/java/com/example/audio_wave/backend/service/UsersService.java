package com.example.audio_wave.backend.service;

import com.example.audio_wave.backend.dto.UsersCreateDTO;
import com.example.audio_wave.backend.dto.UsersDTO;
import com.example.audio_wave.backend.dto.UsersUpdateResponseDTO;
import com.example.audio_wave.backend.entity.Users;
import com.example.audio_wave.backend.enums.UserRole;
import com.example.audio_wave.backend.exception.EmailNotFoundException;
import com.example.audio_wave.backend.exception.InvalidPasswordException;
import com.example.audio_wave.backend.exception.UsersAlreadyExistsException;
import com.example.audio_wave.backend.exception.UsersNotFoundException;
import com.example.audio_wave.backend.repository.UsersRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UsersService {

    private final UsersRepository usersRepository;

    private final PasswordEncoder passwordEncoder;

    public UsersService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsersDTO createUser(UsersCreateDTO usersDTO){
        if(usersRepository.existsByEmail(usersDTO.email())){
            throw new UsersAlreadyExistsException("Error, user already exists!");
        }

        Users users = new Users();
        users.setName(usersDTO.name());
        users.setEmail(usersDTO.email().toLowerCase().trim());
        users.setPassword(passwordEncoder.encode(usersDTO.password()));
        users.setRole(UserRole.USER);

        Users savedUser = usersRepository.save(users);
        return new UsersDTO(savedUser);
    }

    public UsersDTO getUserByEmail(String email){
        return usersRepository.findUserByEmail(email).map(UsersDTO::new)
                .orElseThrow(() -> new EmailNotFoundException("User e-mail not found!"));
    }
    public UsersDTO getUserById(UUID id){
        return usersRepository.findById(id).map(UsersDTO::new)
                .orElseThrow(() -> new UsersNotFoundException("User not found!"));
    }

    private Set<String> validateRoles(Set<String> roles){
        if (roles == null || roles.isEmpty()){
            return Set.of("USER");
        }
        return roles.stream()
                .map(String::toUpperCase)
                .filter(role -> role.equals("USER") || role.equals("ADMIN"))
                .collect(Collectors.toSet());
    }

    public UsersDTO updateUser(UUID id, UsersUpdateResponseDTO dto){
        Users users = usersRepository.findById(id).orElseThrow(() -> new UsersNotFoundException("User not found!"));
        if (dto.name() != null && !dto.name().isBlank()){
            users.setName(dto.name());
        }
        if (dto.email() != null && !dto.email().isBlank()){
            String newlogin = dto.email().toLowerCase().trim();
            if (!newlogin.equalsIgnoreCase(users.getEmail())){
                Optional<Users> userNewEmail = usersRepository.findUserByEmail(newlogin);
                if (userNewEmail.isPresent() && !userNewEmail.get().getId().equals(id)){
                    throw new UsersAlreadyExistsException("Email already exists!");
                }
                users.setEmail(newlogin);
            }
        }
        if (dto.updatedPassword() != null && !dto.updatedPassword().isBlank()){
            if (!passwordEncoder.matches(dto.currentPassword(), users.getPassword())){
                throw new InvalidPasswordException("Current password incorret");
            }
            users.setPassword(passwordEncoder.encode(dto.updatedPassword()));
        }
        Users updatedUser = usersRepository.save(users);
        return new UsersDTO(updatedUser);
    }

    @Transactional
    public void deleteUser(UUID id){
        Users users = usersRepository.findById(id)
                .orElseThrow(() -> new UsersNotFoundException("User not found!"));
        usersRepository.delete(users);
    }

    public List<String> getAllUsers(){
        return usersRepository.findAll()
                .stream()
                .map(Users::getName)
                .collect(Collectors.toList());
    }
}
