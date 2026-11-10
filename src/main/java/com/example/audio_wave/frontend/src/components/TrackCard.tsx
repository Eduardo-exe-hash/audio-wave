import React from 'react';
import type { Track } from '../types/track';
import { AddToPlaylistButton } from '../pages/AddToPlaylistsButton';

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  onToggleFavorite?: (track: Track) => void;
}

export function TrackCard({
  track,
  onPlay,
  onToggleFavorite,
}: TrackCardProps) {
  const rawAudioUrl =
    track.audioUrl ||
    (track as any).audio ||
    (track as any).audio_url ||
    (track as any).audio_file ||
    (track as any).audiodownload ||
    (track as any).streamurl ||
    (track as any).audio_stream ||
    '';

  const rawCoverImage =
    track.coverImageUrl ||
    (track as any).cover_image_url ||
    (track as any).image ||
    (track as any).album_image ||
    (track as any).album_cover ||
    '';

  const normalizedTrack: Track = {
    ...track,
    id: track.id,
    jamendoId: String(track.jamendoId || track.id || ''),
    musicTitle:
      track.musicTitle ||
      (track as any).title ||
      (track as any).name ||
      'Título desconhecido',
    artistName:
      track.artistName ||
      (track as any).artist_name ||
      'Artista desconhecido',
    albumName:
      track.albumName ||
      (track as any).album_name ||
      track.albumTitle ||
      '',
    albumTitle:
      track.albumTitle ||
      track.albumName ||
      (track as any).album_name ||
      '',
    durationSeconds: Number(
      track.durationSeconds || (track as any).duration || 0
    ),
    audioUrl: rawAudioUrl,
    coverImageUrl: rawCoverImage,
    isFavorite: Boolean(track.isFavorite),
  };

  const handlePlay = () => {
    if (!normalizedTrack.audioUrl) {
      console.warn(
        'URL de áudio indisponível para esta faixa:',
        normalizedTrack
      );
      return;
    }

    onPlay(normalizedTrack);
  };

  const handleFavoriteClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!onToggleFavorite) return;

    try {
      await onToggleFavorite(normalizedTrack);
    } catch (error) {
      console.error('Erro ao favoritar música:', error);
    }
  };

  return (
    <article  className="track-card group flex h-full min-w-0 flex-col
                overflow-hidden rounded-2xl
                border border-white/10
                bg-[var(--bg-surface)] p-4 shadow-lg
                transition duration-300
                hover:-translate-y-1
                hover:border-[var(--accent-primary)]
                hover:bg-[var(--bg-surface-hover)]"
             >
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl bg-gray-700">
        {normalizedTrack.coverImageUrl ? (
          <img
            src={normalizedTrack.coverImageUrl}
            alt={`Capa de ${normalizedTrack.musicTitle}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            Sem capa disponível
          </div>
        )}

        <button
          type="button"
          onClick={handlePlay}
          disabled={!normalizedTrack.audioUrl}
          aria-label={`Tocar ${normalizedTrack.musicTitle}`}
          title="Tocar música"
          className="absolute bottom-3 right-3
             flex h-12 w-12 items-center justify-center
             rounded-full accent-bg accent-hover
             text-white shadow-lg transition
             hover:scale-110
             disabled:cursor-not-allowed
             disabled:opacity-50"
        >
          <svg
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="truncate text-base font-bold text-white"
          title={normalizedTrack.musicTitle}
        >
          {normalizedTrack.musicTitle}
        </h3>

        <p
          className="mt-1 truncate text-sm text-gray-400"
          title={normalizedTrack.artistName}
        >
          {normalizedTrack.artistName}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
        {onToggleFavorite ? (
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="rounded-lg p-2
                       text-[var(--text-secondary)]
                       transition
                       hover:bg-[var(--bg-surface-hover)]
                       hover:text-red-400
                       active:scale-95"
            title={
              normalizedTrack.isFavorite
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'
            }
            aria-label={
              normalizedTrack.isFavorite
                ? 'Remover dos favoritos'
                : 'Adicionar aos favoritos'
            }
          >
            {normalizedTrack.isFavorite ? '❤️' : '🤍'}
          </button>
        ) : (
          <span />
        )}

        <div className="min-w-0">
          <AddToPlaylistButton track={normalizedTrack} />
        </div>
      </div>
    </article>
  );
}