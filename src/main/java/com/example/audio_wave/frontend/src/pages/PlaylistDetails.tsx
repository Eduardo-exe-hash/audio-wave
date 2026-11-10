
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Track } from '../types/track';
import { api } from '../services/api';

interface PlaylistAudio {
  id: number;
  jamendoId: string;
  musicTitle: string;
  artistName: string;
  albumName: string;
  genre?: string;
  durationSeconds: number;
  audioUrl: string;
  coverImageUrl: string;
}

interface Playlist {
  id: number;
  namePlaylist: string;
  description?: string;
  isPublic: boolean;
  coverImageUrl: string;
  audios: PlaylistAudio[];
}

interface PlaylistDetailsProps {
  onPlayTrack: (track: Track) => void;
}

export function PlaylistDetails({
  onPlayTrack,
}: PlaylistDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchPlaylist() {
      if (!id || !/^\d+$/.test(id)) {
        setError('ID de playlist inválido.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await api.get<Playlist>(
          `/playlists/${id}`
        );

        if (!cancelled) {
          setPlaylist(response.data);
        }
      } catch (err) {
        console.error('Erro ao carregar playlist:', err);

        if (!cancelled) {
          setError(
            'Não foi possível carregar esta playlist. Verifique se ela existe e se você tem permissão para acessá-la.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPlaylist();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function handlePlayAudio(audio: PlaylistAudio) {
    const track: Track = {
      id: audio.id,
      jamendoId: String(audio.jamendoId),
      musicTitle: audio.musicTitle,
      artistName: audio.artistName,
      albumName: audio.albumName,
      albumTitle: audio.albumName,
      durationSeconds: audio.durationSeconds,
      audioUrl: audio.audioUrl,
      coverImageUrl: audio.coverImageUrl,
      isFavorite: false,
    };

    onPlayTrack(track);
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">
        Carregando playlist...
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-white">
        <button
          type="button"
          onClick={() => navigate('/playlists')}
          className="mb-6 accent-text accent-group-hover transition-colors"
        >
          ← Voltar para minhas playlists
        </button>

        <p className="text-red-400">
          {error || 'Playlist não encontrada.'}
        </p>
      </div>
    );
  }

  const audios = playlist.audios ?? [];

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <button
        type="button"
        onClick={() => navigate('/playlists')}
        className="mb-6 accent-text accent-group-hover transition-colors"
      >
        ← Voltar para minhas playlists
      </button>

      <section className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {playlist.coverImageUrl ? (
            <img
              src={playlist.coverImageUrl}
              alt={`Capa da playlist ${playlist.namePlaylist}`}
              className="w-40 h-40 object-cover rounded-lg"
            />
          ) : (
            <div className="w-40 h-40 rounded-lg accent-gradient-bg flex items-center justify-center text-5xl">
              🎵
            </div>
          )}

          <div>
            <p className="text-sm accent-text mb-2">
              MINHA PLAYLIST
            </p>

            <h1 className="text-3xl font-bold mb-3">
              {playlist.namePlaylist}
            </h1>

            <p className="text-gray-400">
              {playlist.description || 'Sem descrição'}
            </p>

            <p className="text-sm text-gray-400 mt-4">
              {audios.length}{' '}
              {audios.length === 1 ? 'música' : 'músicas'}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          Músicas
        </h2>

        {audios.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
            <p className="text-gray-300 mb-2">
              Esta playlist ainda não possui músicas.
            </p>

            <p className="text-gray-400 text-sm">
              Adicione músicas à playlist para encontrá-las aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {audios.map((audio) => (
              <div
                key={audio.id}
                className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl p-4 accent-border-hover transition-colors"
              >
                {audio.coverImageUrl ? (
                  <img
                    src={audio.coverImageUrl}
                    alt={audio.albumName || audio.musicTitle}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center">
                    🎵
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {audio.musicTitle}
                  </h3>

                  <p className="text-sm text-gray-400 truncate">
                    {audio.artistName || 'Artista desconhecido'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handlePlayAudio(audio)}
                  disabled={!audio.audioUrl}
                  className="px-4 py-2 accent-bg accent-hover disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-colors"
                  aria-label={`Reproduzir ${audio.musicTitle}`}
                >
                  ▶
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
