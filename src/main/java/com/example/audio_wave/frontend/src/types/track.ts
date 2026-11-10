export interface Track {
  id?: number | string;
  jamendoId: string;
  musicTitle: string;
  artistName: string;
  albumName?: string;
  albumTitle?: string;
  durationSeconds?: number;
  audioUrl: string;
  coverImageUrl?: string;
  isFavorite?: boolean;
}