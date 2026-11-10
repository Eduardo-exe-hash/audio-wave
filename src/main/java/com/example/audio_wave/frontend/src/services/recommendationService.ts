import { api } from './api';
import type { Track } from '../types/track';

export const fetchGlobalRecommendations = async (): Promise<Track[]> => {
  const response = await api.get<Track[]>('/recommendations');
  return response.data;
};