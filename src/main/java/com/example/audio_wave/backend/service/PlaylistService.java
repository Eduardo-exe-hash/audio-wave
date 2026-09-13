package com.example.audio_wave.backend.service;

import com.example.audio_wave.backend.dto.AddAudioToPlaylistDTO;
import com.example.audio_wave.backend.dto.AudioResponseDTO;
import com.example.audio_wave.backend.dto.PlaylistRequestDTO;
import com.example.audio_wave.backend.dto.PlaylistResponseDTO;
import com.example.audio_wave.backend.entity.AudioTrack;
import com.example.audio_wave.backend.entity.Playlist;
import com.example.audio_wave.backend.entity.Users;
import com.example.audio_wave.backend.exception.PlaylistNotFoundException;
import com.example.audio_wave.backend.exception.PlaylistOwnerException;
import com.example.audio_wave.backend.repository.AudioRepository;
import com.example.audio_wave.backend.repository.PlaylistsRepository;
import com.example.audio_wave.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service

public class PlaylistService {

    @Autowired
    private PlaylistsRepository playlistsRepository;

    @Autowired
    private AudioRepository audioRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Transactional
    public PlaylistResponseDTO createPlaylist(PlaylistRequestDTO dto, String usersEmail){
        Users users = findByUsersEmail(usersEmail);

        Playlist playlist = new Playlist();
        playlist.setNamePlaylist(dto.namePlaylist());
        playlist.setDescription(dto.description());
        playlist.setIsPublic(dto.isPublic());
        playlist.setCoverImageUrl(dto.coverImageUrl());
        playlist.setUsers(users);

        Playlist saved = playlistsRepository.save(playlist);
        return mapToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<PlaylistResponseDTO> getUsersPlaylist(String usersEmail){
        Users users = findByUsersEmail(usersEmail);
        return playlistsRepository.findByUsersId(users.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlaylistResponseDTO getPlaylistsId(Long playlistsId){
        Playlist playlist = playlistsRepository.findById(playlistsId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not Found!"));
        return mapToDTO(playlist);
    }

    @Transactional
    public PlaylistResponseDTO addAudioToPlaylist(Long playlistsId, AddAudioToPlaylistDTO dto, String usersEmail){
        Playlist playlist = findPlaylistAndValidateOwner(playlistsId, usersEmail);

        AudioTrack audioTrack = audioRepository.findByJamendoId(dto.jamendoId())
                .orElseGet(() ->{
                    AudioTrack newAudioTrack = new AudioTrack();
                    newAudioTrack.setJamendoId(dto.jamendoId());
                    newAudioTrack.setMusicTitle(dto.musicTitle());
                    newAudioTrack.setArtistName(dto.artistName());
                    newAudioTrack.setAlbumName(dto.albumName());
                    newAudioTrack.setDurationSeconds(dto.durationSeconds());
                    newAudioTrack.setAudioUrl(dto.audioUrl());
                    newAudioTrack.setCoverImage(dto.coverImageUrl());
                    return audioRepository.save(newAudioTrack);
                });
        if (!playlist.getAudioTracks().contains(audioTrack)){
            playlist.getAudioTracks().add(audioTrack);
        }
        Playlist updated = playlistsRepository.save(playlist);
        return mapToDTO(updated);
    }

    @Transactional
    public PlaylistResponseDTO removeAudioFromPlaylist(Long playlistsId, Long audioId, String usersEmail){
        Playlist playlist = findPlaylistAndValidateOwner(playlistsId, usersEmail);
        playlist.getAudioTracks().removeIf(audioTrack -> audioTrack.getId().equals(audioId));
        Playlist update = playlistsRepository.save(playlist);
        return mapToDTO(update);
    }

    @Transactional
    public void deleteFromPlaylists(Long playlistsId, String usersEmail){
        Playlist playlist = findPlaylistAndValidateOwner(playlistsId, usersEmail);
        playlistsRepository.delete(playlist);
    }

    private Playlist findPlaylistAndValidateOwner(Long playlistsId, String usersEmail) {
        Playlist playlist = playlistsRepository.findById(playlistsId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist Not Found!"));

        if (!playlist.getUsers().getEmail().equals(usersEmail)){
            throw new PlaylistOwnerException("Access Denied: You're not the owner of this playlist!");
        } return playlist;
    }

    private Users findByUsersEmail(String usersEmail) {
        return (Users) usersRepository.findByEmail(usersEmail);
    }

    private PlaylistResponseDTO mapToDTO(Playlist playlist) {
        List<AudioResponseDTO> audioResponseDTOS = playlist.getAudioTracks().stream()
                .map(audioTrack -> new AudioResponseDTO(
                        audioTrack.getId(),
                        audioTrack.getJamendoId(),
                        audioTrack.getMusicTitle(),
                        audioTrack.getArtistName(),
                        audioTrack.getAlbumName(),
                        audioTrack.getGenre(),
                        audioTrack.getDurationSeconds(),
                        audioTrack.getAudioUrl(),
                        audioTrack.getCoverImage()
                ))
                .collect(Collectors.toList());

        return new PlaylistResponseDTO(
                playlist.getId(),
                playlist.getNamePlaylist(),
                playlist.getDescription(),
                playlist.getIsPublic(),
                playlist.getCoverImageUrl(),
                playlist.getCreatedAt(),
                playlist.getUsers().getId(),
                playlist.getUsers().getEmail(),
                audioResponseDTOS
        );
    }


}
