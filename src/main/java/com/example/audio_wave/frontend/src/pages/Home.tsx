
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import type { Track } from '../types/track';
import { TrackCard } from '../components/TrackCard';

interface HomeProps {
  tracks?: Track[];
  onPlayTrack: (track: Track) => void;
  onToggleFavorite?: (track: Track) => void;
  onLogout: () => void;
}

export function Home({
  tracks: initialTracks,
  onPlayTrack,
  onToggleFavorite,
  onLogout,
}: HomeProps) {
  const navigate = useNavigate();

  const [tracks, setTracks] = useState<Track[]>(initialTracks || []);

  const [loading, setLoading] = useState(
    !initialTracks || initialTracks.length === 0
  );

  const [search, setSearch] = useState('');

  // Redireciona para a página de pesquisa.
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) return;

    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  // Carrega as músicas em destaque.
  useEffect(() => {
    if (initialTracks && initialTracks.length > 0) {
      setTracks(initialTracks);
      setLoading(false);
      return;
    }

    const fetchHomeTracks = async () => {
      setLoading(true);

      try {
        const response = await fetch('/api/music/featured');

        if (!response.ok) {
          throw new Error('Falha ao carregar faixas');
        }

        const data = await response.json();

        const formattedTracks: Track[] = (
          Array.isArray(data) ? data : data.results || []
        ).map((item: any) => ({
          id: item.id,

          jamendoId: String(item.jamendoId || item.id || ''),

          musicTitle:
            item.musicTitle ||
            item.title ||
            item.name ||
            'Título desconhecido',

          artistName:
            item.artistName ||
            item.artist_name ||
            'Artista desconhecido',

          albumName:
            item.albumName ||
            item.album_name ||
            item.albumTitle ||
            '',

          albumTitle:
            item.albumTitle ||
            item.albumName ||
            item.album_name ||
            '',

          durationSeconds: Number(
            item.durationSeconds || item.duration || 0
          ),

          audioUrl:
            item.audioUrl ||
            item.audio ||
            item.audio_file ||
            item.audio_url ||
            item.streamurl ||
            '',

          coverImageUrl:
            item.coverImageUrl ||
            item.cover_image_url ||
            item.image ||
            item.album_image ||
            '',

          isFavorite: Boolean(item.isFavorite),
        }));

        setTracks(formattedTracks);
      } catch (error) {
        console.error('Erro ao buscar músicas da Home:', error);
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeTracks();
  }, [initialTracks]);

  return (
    <main className="relative min-h-screen overflow-hidden
      bg-[var(--bg-main)] text-[var(--text-primary)]">

      {/* Background decorativo */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2
          h-[500px] w-[800px] -translate-x-1/2 rounded-full
          bg-[rgba(var(--accent-rgb),0.08)] blur-[140px]"
      />

      <section
        className="relative mx-auto w-full max-w-[1600px]
          space-y-10 px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
      >
        {/* Cabeçalho */}
        <header className="flex flex-col gap-8">

          <div className="space-y-3">

            <div
              className="flex items-center gap-2 text-xs font-semibold
                uppercase tracking-[0.25em] accent-text"
            >
              <span className="h-1.5 w-1.5 rounded-full accent-bg" />
              Descubra novos sons
            </div>

            <h1
              className="text-3xl font-bold tracking-tight
                sm:text-4xl lg:text-5xl"
            >
              Músicas em{' '}
              <span
                className="bg-gradient-to-r
                  from-[var(--accent-primary)]
                  via-[var(--accent-hover)]
                  to-[var(--accent-cyan)]
                  bg-clip-text text-transparent"
              >
                Destaque
              </span>
            </h1>

            <p
              className="max-w-xl text-sm leading-6
                text-[var(--text-secondary)] sm:text-base"
            >
              Uma seleção de músicas para acompanhar cada
              momento do seu dia.
            </p>

          </div>

          {/* Busca */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-xl items-center gap-3
              rounded-2xl border border-white/[0.08]
              bg-[var(--bg-surface)] px-4 py-3.5
              transition
              focus-within:border-[var(--accent-primary)]
              focus-within:ring-2
              focus-within:ring-[rgba(var(--accent-rgb),0.1)]"
          >

            <svg
              className="h-5 w-5 shrink-0
                text-[var(--text-secondary)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar música, artista ou álbum..."
              aria-label="Buscar músicas"
              className="w-full bg-transparent text-sm
                text-[var(--text-primary)] outline-none
                placeholder:text-[var(--text-secondary)]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="shrink-0 text-xs
                  text-[var(--text-secondary)]
                  transition hover:text-[var(--text-primary)]"
              >
                Limpar
              </button>
            )}

          </form>

          <button
            className="logout-button"
            onClick={onLogout}
            title="Sair"
            aria-label="Sair"
          >
            <LogOut size={20} />
          </button>

        </header>

        {/* Conteúdo */}
        <div className="space-y-6">

          <div
            className="flex items-center justify-between
              border-b border-white/[0.07] pb-4"
          >

            <h2
              className="text-lg font-semibold tracking-tight
                sm:text-xl"
            >
              Para ouvir agora
            </h2>

            {!loading && (
              <span
                className="rounded-full border
                  border-white/[0.08]
                  bg-white/[0.03] px-3 py-1
                  text-xs font-medium
                  text-[var(--text-secondary)]"
              >
                {tracks.length}{' '}
                {tracks.length === 1 ? 'música' : 'músicas'}
              </span>
            )}

          </div>

          {/* Loading */}
          {loading ? (
            <div
              className="grid grid-cols-2 gap-4
                sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl
                    border border-white/[0.06]
                    bg-[var(--bg-surface)] p-4"
                >
                  <div
                    className="aspect-square rounded-xl
                      bg-[var(--bg-surface-hover)]"
                  />

                  <div
                    className="mt-4 h-4 w-3/4 rounded
                      bg-[var(--bg-surface-hover)]"
                  />

                  <div
                    className="mt-2 h-3 w-1/2 rounded
                      bg-[var(--bg-surface-hover)]"
                  />

                  <div
                    className="mt-5 h-10 rounded-xl
                      bg-[var(--bg-surface-hover)]"
                  />
                </div>
              ))}
            </div>

          ) : tracks.length === 0 ? (

            /* Estado vazio */
            <div
              className="flex flex-col items-center justify-center
                rounded-3xl border border-dashed border-white/10
                bg-white/[0.02] px-6 py-20 text-center"
            >

              <div
                className="mb-5 flex h-16 w-16 items-center
                  justify-center rounded-2xl
                  bg-[rgba(var(--accent-rgb),0.1)] accent-text"
              >
                <svg
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 9h.01M15 9h.01M8 15s1.5-2 4-2 4 2 4 2" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold">
                Sua biblioteca está vazia
              </h3>

              <p
                className="mt-2 max-w-sm text-sm
                  text-[var(--text-secondary)]"
              >
                Não encontramos músicas em destaque no momento.
              </p>

            </div>

          ) : (

            /* Grid de músicas */
            <div
              className="grid grid-cols-1 gap-5
                sm:grid-cols-2 md:grid-cols-3
                lg:grid-cols-4 2xl:grid-cols-5"
            >
              {tracks.map((track) => (
                <TrackCard
                  key={track.jamendoId || track.id}
                  track={track}
                  onPlay={onPlayTrack}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>

          )}

        </div>
      </section>
    </main>
  );
}
