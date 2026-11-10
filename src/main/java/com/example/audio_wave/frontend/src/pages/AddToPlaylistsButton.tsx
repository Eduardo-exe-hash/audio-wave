
import { useState } from 'react';
import type { Track } from '../types/track';
import { api } from '../services/api';

interface Playlist {
  id: number;
  namePlaylist: string;
}

interface Props {
  track: Track;
}

export function AddToPlaylistButton({ track }: Props) {
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  async function openPlaylistSelector() {
    setOpen(true);
    setError('');
    setLoading(true);

    try {
      const response = await api.get<Playlist[]>('/playlists/me');
      setPlaylists(response.data || []);
      setCreating(!response.data?.length);
    } catch (err) {
      console.error('Erro ao carregar playlists:', err);
      setError('Não foi possível carregar suas playlists.');
    } finally {
      setLoading(false);
    }
  }

  async function addTrack(playlistId: number) {
    setLoading(true);
    setError('');

    try {
      await api.post(`/playlists/${playlistId}/audios`, {
        jamendoId: String(track.jamendoId || track.id),
        musicTitle: track.musicTitle,
        artistName: track.artistName || '',
        albumName: track.albumName || track.albumTitle || '',
        durationSeconds: track.durationSeconds || 0,
        audioUrl: track.audioUrl || '',
        coverImage: track.coverImageUrl || '',
      });

      setOpen(false);
      alert('Música adicionada à playlist!');
    } catch (err) {
      console.error('Erro ao adicionar música:', err);
      setError('Não foi possível adicionar a música à playlist.');
    } finally {
      setLoading(false);
    }
  }

  async function createAndAddTrack(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError('Digite um nome para a playlist.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post<Playlist>('/playlists', {
        namePlaylist: name.trim(),
        description: '',
        isPublic: false,
        coverImageUrl: track.coverImageUrl || '',
      });

      await addTrack(response.data.id);
    } catch (err) {
      console.error('Erro ao criar playlist ou adicionar música:', err);
      setError(
        'Não foi possível criar a playlist ou adicionar a música.'
      );
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={openPlaylistSelector}
        className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-indigo-600 text-white transition"
      >
        ＋ Adicionar à playlist
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6 text-white">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">
                Adicionar música
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-300">
              {track.musicTitle}
            </p>

            {loading && (
              <p className="mb-3 text-gray-400">Carregando...</p>
            )}

            {error && (
              <p className="mb-3 text-sm text-red-400">{error}</p>
            )}

            {!loading && !creating && playlists.length > 0 && (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    type="button"
                    disabled={loading}
                    onClick={() => addTrack(playlist.id)}
                    className="w-full rounded-lg bg-gray-800 p-3 text-left hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {playlist.namePlaylist}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setCreating(true);
                    setError('');
                  }}
                  className="mt-2 w-full rounded-lg border border-indigo-500 p-3 text-indigo-300 hover:bg-indigo-500/10"
                >
                  + Criar nova playlist
                </button>
              </div>
            )}

            {creating && (
              <form onSubmit={createAndAddTrack} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome da playlist"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 p-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
                >
                  Criar e adicionar música
                </button>

                {playlists.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCreating(false)}
                    className="w-full rounded-lg bg-gray-800 p-2 hover:bg-gray-700"
                  >
                    Voltar às playlists
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
