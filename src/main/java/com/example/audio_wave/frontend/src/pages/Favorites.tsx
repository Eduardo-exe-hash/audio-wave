
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Track } from '../types/track';

interface FavoritesProps {
  onPlayTrack: (track: Track) => void;
}

export function Favorites({ onPlayTrack }: FavoritesProps) {
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Carrega os favoritos
  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<Track[]>('/favorites');
      setFavorites(response.data);
    } catch (err) {
      console.error('Erro ao carregar favoritos:', err);
      setError('Não foi possível carregar seus favoritos.');
    } finally {
      setLoading(false);
    }
  };

  // Remove uma música dos favoritos
  const handleRemoveFavorite = async (track: Track) => {
    const trackKey = String(track.jamendoId || track.id);

    try {
      setRemovingId(trackKey);

      // Utiliza o ID interno ou o ID do Jamendo
      const targetId = track.id || track.jamendoId;

      await api.delete(`/favorites/${targetId}`);

      setFavorites((prevFavorites) =>
        prevFavorites.filter(
          (item) =>
            String(item.jamendoId || item.id) !== trackKey
        )
      );
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
      alert('Erro ao remover dos favoritos.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">

      {/* Background decorativo */}
      <div
        className="theme-glow pointer-events-none absolute -top-40 left-1/2
        h-[500px] w-[800px] -translate-x-1/2 rounded-full
        blur-[140px]"
      />

      <section
        className="relative mx-auto w-full max-w-[1600px]
        space-y-10 px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
      >

        {/* Cabeçalho */}
        <header className="flex flex-col gap-6">
          <div className="space-y-3">
            <div
              className="accent-text flex items-center gap-2 text-xs font-semibold
              uppercase tracking-[0.25em]"
            >
              <span className="accent-dot h-1.5 w-1.5 rounded-full" />
              Sua coleção pessoal
            </div>

            <h1
              className="text-3xl font-bold tracking-tight
              sm:text-4xl lg:text-5xl"
            >
              Minhas músicas{' '}
              <span className="accent-gradient-text">
                favoritas
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
              Todas as músicas que conquistaram um lugar
              especial na sua coleção.
            </p>
          </div>

          {/* Informações da coleção */}
          {!loading && !error && (
            <div
              className="flex items-center justify-between
              border-b border-white/[0.07] pb-4"
            >
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                Sua biblioteca
              </h2>

              <span
                className="rounded-full border
                border-white/[0.08] bg-[var(--bg-surface)]
                px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
              >
                {favorites.length}{' '}
                {favorites.length === 1 ? 'música' : 'músicas'}
              </span>
            </div>
          )}
        </header>

        {/* Carregamento */}
        {loading && (
          <div
            className="grid grid-cols-1 gap-5
            sm:grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 2xl:grid-cols-5"
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl
                border border-white/[0.06]
                bg-[var(--bg-surface)] p-4"
              >
                <div className="aspect-square rounded-xl bg-[var(--bg-surface-hover)]" />

                <div className="mt-4 h-4 w-3/4 rounded bg-[var(--bg-surface-hover)]" />

                <div className="mt-2 h-3 w-1/2 rounded bg-[var(--bg-surface-hover)]" />

                <div className="mt-5 h-10 rounded-xl bg-[var(--bg-surface-hover)]" />
              </div>
            ))}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div
            className="rounded-2xl border border-red-500/20
            bg-red-500/[0.06] p-6 text-center"
          >
            <p className="text-sm text-red-300">{error}</p>

            <button
              onClick={fetchFavorites}
              className="accent-bg accent-hover mt-4 rounded-xl
              px-5 py-2.5 text-sm font-medium text-white transition"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Favoritos */}
        {!loading && !error && favorites.length > 0 && (
          <div
            className="grid grid-cols-1 gap-5
            sm:grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 2xl:grid-cols-5"
          >
            {favorites.map((track) => {
              const trackKey = String(
                track.jamendoId || track.id
              );

              const isRemoving = removingId === trackKey;

              return (
                <div
                  key={trackKey}
                  className="group flex flex-col rounded-2xl
                  border border-white/[0.07]
                  bg-[var(--bg-surface)] p-4
                  transition duration-300
                  hover:-translate-y-1
                  accent-border-hover
                  accent-card-hover"
                >
                  {/* Capa */}
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--bg-surface-hover)]">
                    {track.coverImageUrl ? (
                      <img
                        src={track.coverImageUrl}
                        alt={track.musicTitle}
                        loading="lazy"
                        className="h-full w-full object-cover
                        transition duration-500
                        group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full
                        items-center justify-center
                        bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]"
                      >
                        <svg
                          className="h-12 w-12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path d="M9 18V5l12-2v13" />
                          <circle cx="6" cy="18" r="3" />
                          <circle cx="18" cy="16" r="3" />
                        </svg>
                      </div>
                    )}

                    {/* Overlay da capa */}
                    <div
                      className="absolute inset-0
                      bg-black/0 transition
                      group-hover:bg-black/20"
                    />

                    {/* Indicador de favorito */}
                    <div
                      className="accent-text absolute right-3 top-3
                      flex h-8 w-8 items-center justify-center
                      rounded-full bg-black/40 backdrop-blur-sm"
                      title="Música favorita"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0
                          L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78
                          7.78l1.06 1.06L12 21.23l7.78-7.78
                          1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="mt-4 min-w-0">
                    <h3
                      className="truncate text-base font-bold
                      tracking-tight text-[var(--text-primary)]"
                      title={track.musicTitle}
                    >
                      {track.musicTitle}
                    </h3>

                    <p
                      className="mt-1 truncate text-sm text-[var(--text-secondary)]"
                      title={track.artistName}
                    >
                      {track.artistName}
                    </p>

                    {track.albumName && (
                      <p
                        className="mt-1 truncate text-xs text-[var(--text-secondary)]"
                        title={track.albumName}
                      >
                        {track.albumName}
                      </p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="mt-auto flex gap-2 pt-5">
                    <button
                      onClick={() => onPlayTrack(track)}
                      className="accent-bg accent-hover flex flex-1 items-center
                      justify-center gap-2 rounded-xl
                      px-3 py-2.5 text-sm font-semibold text-white
                      transition active:scale-[0.98]"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>

                      Tocar
                    </button>

                    <button
                      onClick={() => handleRemoveFavorite(track)}
                      disabled={isRemoving}
                      className="flex items-center
                      justify-center rounded-xl
                      border border-white/[0.08]
                      bg-[var(--bg-surface-hover)] px-3 py-2.5
                      text-[var(--text-secondary)] transition
                      hover:border-red-500/30
                      hover:bg-red-500/10
                      hover:text-red-400
                      disabled:cursor-not-allowed
                      disabled:opacity-50"
                      title="Remover dos favoritos"
                      aria-label={`Remover ${track.musicTitle} dos favoritos`}
                    >
                      {isRemoving ? (
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="opacity-25"
                          />

                          <path
                            d="M4 12a8 8 0 0 1 8-8"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="opacity-75"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="m19 6-1 14H6L5 6" />
                          <path d="M10 11v5M14 11v5" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Estado vazio */}
        {!loading && !error && favorites.length === 0 && (
          <div
            className="flex flex-col items-center
            justify-center rounded-3xl
            border border-dashed border-white/10
            bg-[var(--bg-surface)] px-6 py-20 text-center"
          >
            <div
              className="accent-soft-bg mb-5 flex h-20 w-20
              items-center justify-center rounded-3xl border"
            >
              <svg
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0
                  L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78
                  7.78l1.06 1.06L12 21.23l7.78-7.78
                  1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-semibold">
              Sua coleção está esperando por você
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
              Você ainda não adicionou músicas aos favoritos.
              Explore novas faixas e salve aquelas que mais gostar.
            </p>
          </div>
        )}

      </section>
    </main>
  );
}
