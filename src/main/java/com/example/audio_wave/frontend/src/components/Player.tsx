import { useState, useRef, useEffect } from 'react';
import type { Track } from '../types/track';

interface PlayerProps {
  currentTrack: Track | null;
  onClose?: () => void;
}

export function Player({ currentTrack, onClose }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const playAudio = async () => {
      if (!currentTrack?.audioUrl || !audioRef.current) return;

      try {
        audioRef.current.load();
        audioRef.current.currentTime = 0;
        await audioRef.current.play();

        if (isMounted) setIsPlaying(true);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Erro ao reproduzir áudio:', err);
        }

        if (isMounted) setIsPlaying(false);
      }
    };

    playAudio();

    return () => {
      isMounted = false;
    };
  }, [currentTrack?.audioUrl]);

  if (!currentTrack) return null;

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      void audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';

    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)] border-t border-[var(--bg-surface-hover)] text-[var(--text-primary)] px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 z-50 shadow-2xl"
    >
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Info da Música */}
      <div className="flex items-center gap-4 w-full md:w-1/4">
        {currentTrack.coverImageUrl ? (
          <img
            src={currentTrack.coverImageUrl}
            alt={currentTrack.musicTitle}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-[var(--bg-surface-hover)] rounded-lg flex items-center justify-center text-xs text-[var(--text-secondary)]">
            Sem Capa
          </div>
        )}

        <div className="truncate">
          <h4 className="font-semibold text-sm truncate">
            {currentTrack.musicTitle}
          </h4>
          <p className="text-xs text-[var(--text-secondary)] truncate">
            {currentTrack.artistName || 'Artista desconhecido'}
          </p>
        </div>
      </div>

      {/* Controles Principais e Progresso */}
      <div className="flex flex-col items-center gap-2 w-full md:w-2/4">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="p-3 accent-bg accent-hover text-white rounded-full transition-transform active:scale-95"
            title={isPlaying ? 'Pausar' : 'Tocar'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Barra de Progresso */}
        <div className="flex items-center gap-3 w-full text-xs text-[var(--text-secondary)]">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            style={{
              '--range-progress': `${
                duration > 0
                  ? (currentTime / duration) * 100
                  : 0
              }%`
            } as React.CSSProperties}
            className="theme-range w-full h-1 rounded-lg"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Fechar */}
      <div className="flex items-center justify-end gap-4 w-full md:w-1/4">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[var(--text-secondary)]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            style={{
              '--range-progress': `${volume * 100}%`
            } as React.CSSProperties}
            className="theme-range w-20 h-1 rounded-lg"
          />
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            title="Fechar Player"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
