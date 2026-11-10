
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Playlist {
  id: number;
  namePlaylist: string;
  description?: string;
  isPublic: boolean;
  coverImageUrl: string;
  createdAt?: string;
  userId?: string;
  usersEmail?: string;
  audios?: unknown[];
}

export function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);

    try {
      const response = await api.get<Playlist[]>('/playlists/me');
      setPlaylists(response.data);
    } catch (err) {
      console.error('Erro ao carregar playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || creating) return;

    setCreating(true);

    try {
      const response = await api.post<Playlist>('/playlists', {
        namePlaylist: name.trim(),
        description: description.trim(),
        isPublic: false,
        coverImageUrl: ''
      });

      setPlaylists(prev => [...prev, response.data]);
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Erro ao criar playlist:', err);
      alert('Erro ao criar playlist.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101827] text-white">
      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* CABEÇALHO */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-sm font-semibold tracking-widest uppercase accent-text">
                Sua biblioteca
              </span>

              <h1 className="text-4xl font-bold mt-2 tracking-tight">
                Minhas Playlists
              </h1>

              <p className="text-gray-400 mt-2">
                Organize suas músicas e crie momentos únicos.
              </p>
            </div>

            <div className="bg-[#1e293b] border border-gray-700/70 rounded-xl px-5 py-3">
              <span className="text-gray-400 text-sm">
                Playlists criadas
              </span>
              <p className="text-2xl font-bold text-white">
                {playlists.length}
              </p>
            </div>
          </div>
        </header>

        {/* FORMULÁRIO */}
        <section className="bg-[#1e293b] border border-gray-700/70 rounded-2xl p-6 sm:p-8 mb-10 shadow-xl shadow-black/10">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl accent-soft-bg flex items-center justify-center">
              <svg
                className="w-6 h-6 accent-text"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Criar nova playlist
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Dê um nome e uma identidade à sua coleção.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreatePlaylist} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome da playlist
              </label>

              <input
                type="text"
                placeholder="Ex: Minhas favoritas..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#101827] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none transition-all focus:accent-border accent-input-focus"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição
                <span className="text-gray-500 font-normal ml-2">
                  (Opcional)
                </span>
              </label>

              <input
                type="text"
                placeholder="Conte um pouco sobre essa playlist..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-[#101827] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none transition-all focus:accent-border accent-input-focus"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={creating || !name.trim()}
                className="flex items-center justify-center gap-2 px-7 py-3 accent-bg accent-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all duration-200 accent-shadow-hover active:scale-95"
              >
                {creating ? (
                  'Criando...'
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Criar Playlist
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* LISTAGEM */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Suas coleções
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Todas as suas playlists em um só lugar.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-gray-400 animate-pulse py-10">
              Carregando suas playlists...
            </div>
          ) : playlists.length === 0 ? (
            <div className="bg-[#1e293b] border border-gray-700/70 border-dashed rounded-2xl py-16 px-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl accent-soft-bg flex items-center justify-center mb-5">
                <svg
                  className="w-8 h-8 accent-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M9 18V5l12-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm12-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold mb-2">
                Sua biblioteca está vazia
              </h3>

              <p className="text-gray-400 max-w-md mx-auto">
                Você ainda não possui playlists. Crie sua primeira coleção
                e comece a organizar suas músicas!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  type="button"
                  onClick={() => navigate(`/playlists/${playlist.id}`)}
                  className="group text-left w-full bg-[#1e293b] border border-gray-700/70 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 accent-border-hover hover:shadow-xl hover:shadow-black/20 focus:outline-none accent-focus"
                >

                  {/* CAPA */}
                  <div className="relative h-44 overflow-hidden accent-gradient-bg">

                    {playlist.coverImageUrl ? (
                      <img
                        src={playlist.coverImageUrl}
                        alt={`Capa da playlist ${playlist.namePlaylist}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute w-40 h-40 accent-glow rounded-full blur-3xl" />

                        <svg
                          className="relative w-20 h-20 text-white/80 transition-transform duration-500 group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.2"
                            d="M9 18V5l12-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm12-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <span className="absolute top-4 left-4 px-3 py-1 bg-black/30 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/10">
                      Playlist
                    </span>

                    <div className="absolute bottom-4 right-4 w-10 h-10 accent-bg rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <svg
                        className="w-5 h-5 text-white ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* INFORMAÇÕES */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white truncate accent-group-hover transition-colors">
                      {playlist.namePlaylist}
                    </h3>

                    <p className="text-gray-400 text-sm mt-2 line-clamp-2 min-h-10">
                      {playlist.description || 'Sem descrição'}
                    </p>

                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-700/70">
                      <span className="accent-text text-sm font-semibold accent-group-hover transition-colors">
                        Abrir playlist
                      </span>

                      <svg
                        className="w-5 h-5 accent-text transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12h14m-7-7 7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}

            </div>
          )}
        </section>

      </main>
    </div>
  );
}
