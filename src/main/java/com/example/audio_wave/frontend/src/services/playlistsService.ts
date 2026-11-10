import {api} from "./api";

export interface Track {
  jamendoId: string;
  musicTitle: string;
  artistName?: string;
  albumName?: string;
  durationSeconds?: number;
  audioUrl?: string;
  coverImageUrl?: string;
}

export interface PlaylistAudio {
  id: number;
  jamendoId: string;
  musicTitle: string;
  artistName?: string;
  albumName?: string;
  genre?: string;
  durationSeconds?: number;
  audioUrl?: string;
  coverImageUrl?: string;
}

export interface Playlist {
  id: number;
  namePlaylist: string;
  description: string | null;
  isPublic: boolean;
  coverImageUrl: string;
  createdAt: string;
  userId: string;
  usersEmail: string;
  audios: PlaylistAudio[];
}

export interface PlaylistRequest {
  namePlaylist: string;
  description: string;
  isPublic: boolean;
  coverImageUrl: string;
}

export async function getMyPlaylists(): Promise<Playlist[]> {
  const response = await api.get<Playlist[]>("/api/playlists/me");
  return response.data;
}

export async function createPlaylist(
  data: PlaylistRequest
): Promise<Playlist> {
  const response = await api.post<Playlist>("/api/playlists", data);
  return response.data;
}

export async function addTrackToPlaylist(
  playlistId: number,
  track: Track
): Promise<Playlist> {
  const response = await api.post<Playlist>(
    `/api/playlists/${playlistId}/audios`,
    {
      jamendoId: track.jamendoId,
      musicTitle: track.musicTitle,
      artistName: track.artistName ?? "",
      albumName: track.albumName ?? "",
      durationSeconds: track.durationSeconds ?? 0,
      audioUrl: track.audioUrl ?? "",
      coverImageUrl: track.coverImageUrl ?? "",
    }
  );

  return response.data;
}
