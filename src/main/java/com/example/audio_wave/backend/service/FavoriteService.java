package com.example.audio_wave.backend.service;

import com.example.audio_wave.backend.dto.AddAudioToPlaylistDTO;
import com.example.audio_wave.backend.dto.FavoriteResponseDTO;
import com.example.audio_wave.backend.entity.AudioTrack;
import com.example.audio_wave.backend.entity.Favorite;
import com.example.audio_wave.backend.entity.FavoriteId;
import com.example.audio_wave.backend.entity.Users;
import com.example.audio_wave.backend.exception.UsersNotFoundException;
import com.example.audio_wave.backend.repository.AudioRepository;
import com.example.audio_wave.backend.repository.FavoriteRepository;
import com.example.audio_wave.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private AudioRepository audioRepository;

    @Autowired
    private UsersRepository usersRepository;


    @Transactional
    public FavoriteResponseDTO addFavorite(UUID usersId, AddAudioToPlaylistDTO dto){
        Users users =usersRepository.findById(usersId)
                .orElseThrow(()-> new UsersNotFoundException("User Not Found!"));

        AudioTrack audioTrack = audioRepository.findByJamendoId(dto.jamendoId())
                .orElseGet(() ->{
                    AudioTrack newAudio = new AudioTrack();
                    newAudio.setJamendoId(dto.jamendoId());
                    newAudio.setMusicTitle(dto.musicTitle());
                    newAudio.setArtistName(dto.artistName());
                    newAudio.setAlbumName(dto.albumName());
                    newAudio.setDurationSeconds(dto.durationSeconds());
                    newAudio.setAudioUrl(dto.audioUrl());
                    newAudio.setCoverImage(dto.coverImageUrl());
                    return audioRepository.save(newAudio);
                });

        FavoriteId favoriteId = new FavoriteId(users.getId(), audioTrack.getId());
        if (favoriteRepository.existsById(favoriteId)){
            throw new RuntimeException("This bang is already in your favorites");
        }

        Favorite favorite = new Favorite(users,audioTrack);
        Favorite savedFavorite = favoriteRepository.save(favorite);
        return FavoriteResponseDTO.fromEntity(savedFavorite);
    }

    @Transactional
    public void removeFromFavorite(UUID usersId, Long audioId){
        FavoriteId favoriteId = new FavoriteId(usersId,audioId);

        if (!favoriteRepository.existsById(favoriteId)){
            throw new RuntimeException("Music not found!");
        }
        favoriteRepository.deleteById(favoriteId);
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponseDTO> getUserFavorites(UUID usersId){
        return favoriteRepository.findById_UserIdOrderByFavoritedAtDesc(usersId)
                .stream()
                .map(FavoriteResponseDTO::fromEntity)
                .toList();
    }
}
