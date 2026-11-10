import { api } from './api';
import type { Track } from '../types/track';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

export const fetchUserFavorites = async (): Promise<Track[]> => {
  const response = await api.get<Track[]>(`/favorites`, getAuthHeaders());
  return response.data;
};

export const addFavorite = async (track: Track): Promise<void> => {
  const payload = {
    jamendoId: String(track.jamendoId || ''),
    musicTitle: track.musicTitle || '',
    artistName: track.artistName || '',
    albumName: track.albumName || '',
    genre: (track as Track & { genre?: string }).genre || '',
    durationSeconds: Number(track.durationSeconds),
    audioUrl: track.audioUrl || '',
    coverImageUrl: track.coverImageUrl || '',
  };

  console.log('Enviando favorito:', payload);

  const response = await api.post('/favorites', payload);

  console.log('Resposta do backend:', response.status, response.data);
};

export const removeFavorite = async (audioId: number): Promise<void> => {
  await api.delete(`/favorites/${audioId}`);
};