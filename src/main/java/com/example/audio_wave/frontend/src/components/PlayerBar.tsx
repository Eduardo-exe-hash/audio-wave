import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { formatTime } from '../utils/formatTime';
import type { Track } from '../types/track';

interface PlayerBarProps {
  currentTrack: Track | null;
  onTrackEnd?: () => void;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({ currentTrack, onTrackEnd }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toca automaticamente quando a faixa atual muda
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Erro na reprodução automática:', err);
        });
    }
  }, [currentTrack]);

  // Handler disparado continuamente conforme a música toca
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Handler para capturar a duração assim que o áudio carrega
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handler para seek (quando o usuário clica ou arrasta a barra de progresso)
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[var(--bg-surface)] border-t border-[var(--bg-surface-hover)] flex items-center justify-between px-6 z-50 text-[var(--text-secondary)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-[var(--bg-surface-hover)] flex items-center justify-center">
            <Music className="w-6 h-6 text-[var(--accent-primary)]" />
          </div>
          <span className="text-sm">Nenhuma faixa selecionada</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-surface)] border-t border-[var(--bg-surface-hover)] flex flex-col justify-center px-6 py-3 z-50 h-24">
      {/* Elemento HTML5 Audio com escutadores de eventos */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onTrackEnd}
      />

      <div className="flex items-center justify-between w-full">
        {/* Info da Música */}
        <div className="flex items-center gap-4 w-1/4">
          <img
            src={currentTrack.coverImageUrl}
            alt={currentTrack.musicTitle}
            className="w-12 h-12 rounded object-cover shadow"
          />

          <div className="overflow-hidden">
            <h4 className="text-[var(--text-primary)] text-sm font-medium truncate">
              {currentTrack.musicTitle}
            </h4>
            <p className="text-[var(--text-secondary)] text-xs truncate">
              {currentTrack.artistName}
            </p>
          </div>
        </div>

        {/* Controles Principais + Barra de Progresso */}
        <div className="flex flex-col items-center gap-2 w-1/2 max-w-xl">
          {/* Botão Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white flex items-center justify-center transition cursor-pointer shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          {/* Barra de Progresso + Tempos */}
          <div className="flex items-center gap-3 w-full text-xs text-[var(--text-secondary)]">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
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

        {/* Controles de Volume */}
        <div className="flex items-center gap-3 w-1/4 justify-end">
          <button
            onClick={toggleMute}
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
