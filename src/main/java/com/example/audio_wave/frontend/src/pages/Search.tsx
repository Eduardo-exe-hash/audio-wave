
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon,
  Music2,
  Sparkles,
  X,
  Disc3,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react';

import type { Track } from '../types/track';
import { TrackCard } from '../components/TrackCard';
import {
  addFavorite,
  removeFavorite,
} from '../services/favoriteService';

interface SearchProps {
  onPlayTrack: (track: Track) => void;
  onToggleFavorite?: (track: Track) => void;
  favoritesList?: Track[];
}

export function Search({
  onPlayTrack,
  onToggleFavorite,
  favoritesList = [],
}: SearchProps) {
  const [searchParams] = useSearchParams();

  const initialQuery = searchParams.get('query') || '';

  const [query, setQuery] = useState(initialQuery);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Executa a pesquisa
  const handleSearch = async (
    e?: React.FormEvent,
    searchQuery: string = query
  ) => {
    e?.preventDefault();

    const term = searchQuery.trim();

    if (!term || loading) return;

    setQuery(term);
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/music/search?query=${encodeURIComponent(term)}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar músicas');
      }

      const data = await response.json();

      const formattedTracks: Track[] = (
        Array.isArray(data) ? data : data.results || []
      ).map((item: any) => {
        const jamendoIdStr = String(
          item.jamendoId || item.id || ''
        );

        const isFav = favoritesList.some(
          (fav) =>
            String(fav.jamendoId || fav.id) === jamendoIdStr
        );

        return {
          id: item.id,
          jamendoId: jamendoIdStr,

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
            item.audio_url ||
            item.streamurl ||
            '',

          coverImageUrl:
            item.coverImageUrl ||
            item.cover_image_url ||
            item.image ||
            item.album_image ||
            '',

          isFavorite: isFav,
        };
      });

      setTracks(formattedTracks);
    } catch (err) {
      console.error('Erro na pesquisa:', err);
      setError('Ocorreu um erro ao buscar as músicas.');
    } finally {
      setLoading(false);
    }
  };

  // Pesquisa automaticamente ao entrar com uma query na URL
  useEffect(() => {
    if (initialQuery.trim()) {
      handleSearch(undefined, initialQuery);
    }
  }, [initialQuery]);

  // Gerencia os favoritos
  const handleToggleFavInternal = async (track: Track) => {
    const isCurrentlyFavorite = tracks.some(
      (t) =>
        (t.jamendoId || t.id) === (track.jamendoId || track.id) &&
        t.isFavorite
    );

    try {
      if (isCurrentlyFavorite) {
        if (typeof track.id !== 'number') {
          console.error(
            'O ID interno do áudio é necessário para remover o favorito.',
            track
          );
          return;
        }

        await removeFavorite(track.id);
      } else {
        await addFavorite(track);
      }

      setTracks((prevTracks) =>
        prevTracks.map((t) =>
          (t.jamendoId || t.id) === (track.jamendoId || track.id)
            ? { ...t, isFavorite: !isCurrentlyFavorite }
            : t
        )
      );

      onToggleFavorite?.(track);
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  // Limpa a pesquisa
  const handleClearSearch = () => {
    setQuery('');
    setTracks([]);
    setError(null);
    setHasSearched(false);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 py-8 sm:py-12 text-white">

      <div className="max-w-7xl mx-auto">

        {/* CABEÇALHO */}
        <header className="mb-10">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-12 h-12 rounded-2xl accent-soft-bg flex items-center justify-center">
              <SearchIcon
                size={25}
                className="accent-text"
              />
            </div>

            <span className="text-sm font-semibold tracking-widest uppercase accent-text">
              Descubra novas músicas
            </span>

          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Explore sua próxima{' '}
            <span className="accent-gradient-text">
              música favorita.
            </span>
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl leading-relaxed">
            Pesquise por músicas, artistas ou álbuns e descubra
            novos sons para adicionar à sua coleção.
          </p>

        </header>

        {/* ÁREA DE PESQUISA */}
        <section className="relative bg-[#1e293b] border border-gray-700/70 rounded-2xl p-5 sm:p-7 mb-10 shadow-xl shadow-black/10 overflow-hidden">

          {/* Brilho decorativo */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full theme-glow blur-3xl pointer-events-none" />

          <div className="relative">

            <div className="flex items-center gap-2 mb-5">

              <Sparkles
                size={20}
                className="accent-text"
              />

              <h2 className="text-lg font-bold">
                O que você quer ouvir hoje?
              </h2>

            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3"
            >

              {/* Campo de pesquisa */}
              <div className="relative flex-1 min-w-0">

                <SearchIcon
                  size={21}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nome da música, artista ou álbum..."
                  className="w-full h-14 pl-12 pr-12 bg-[#101827] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20"
                />

                {query && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    aria-label="Limpar pesquisa"
                  >
                    <X size={19} />
                  </button>
                )}

              </div>

              {/* Botão de pesquisa */}
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="h-14 px-8 flex items-center justify-center gap-2 accent-bg accent-hover text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg accent-shadow active:scale-[0.98]"
              >

                {loading ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />
                    Buscando...
                  </>
                ) : (
                  <>
                    <SearchIcon size={19} />
                    Buscar músicas
                  </>
                )}

              </button>

            </form>

            <p className="text-gray-500 text-xs mt-4">
              Dica: experimente pesquisar pelo nome de um artista
              ou de um álbum.
            </p>

          </div>

        </section>

        {/* ERRO */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-8 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300">

            <AlertCircle
              size={21}
              className="shrink-0"
            />

            <p className="text-sm">
              {error}
            </p>

          </div>
        )}

        {/* RESULTADOS */}
        <section>

          {/* Cabeçalho dos resultados */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

            <div>

              <h2 className="text-2xl font-bold">
                {hasSearched ? 'Resultados da pesquisa' : 'Explore músicas'}
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                {loading
                  ? 'Procurando músicas para você...'
                  : hasSearched
                    ? `${tracks.length} ${tracks.length === 1 ? 'música encontrada' : 'músicas encontradas'}`
                    : 'Sua próxima descoberta musical começa aqui.'}
              </p>

            </div>

            {tracks.length > 0 && !loading && (
              <div className="flex items-center gap-2 text-sm accent-text accent-soft-bg px-4 py-2 rounded-full w-fit">

                <Music2 size={17} />

                <span className="font-medium">
                  {tracks.length} resultados
                </span>

              </div>
            )}

          </div>

          {/* CARREGAMENTO */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">

              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1e293b] border border-gray-700/50 rounded-2xl p-4 animate-pulse"
                >

                  <div className="aspect-square bg-gray-700/60 rounded-xl mb-4" />

                  <div className="h-4 bg-gray-700/60 rounded w-3/4 mb-3" />

                  <div className="h-3 bg-gray-700/40 rounded w-1/2" />

                </div>
              ))}

            </div>
          )}

          {/* CARDS DAS MÚSICAS */}
          {!loading && tracks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">

              {tracks.map((track) => (
                <TrackCard
                  key={track.jamendoId || track.id}
                  track={track}
                  onPlay={onPlayTrack}
                  onToggleFavorite={handleToggleFavInternal}
                />
              ))}

            </div>
          )}

          {/* NENHUM RESULTADO */}
          {!loading && hasSearched && tracks.length === 0 && !error && (
            <div className="bg-[#1e293b] border border-gray-700/70 border-dashed rounded-2xl py-16 px-6 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-700/40 flex items-center justify-center mb-5">

                <Disc3
                  size={34}
                  className="text-gray-400"
                />

              </div>

              <h3 className="text-xl font-bold mb-2">
                Nenhuma música encontrada
              </h3>

              <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                Não encontramos resultados para essa pesquisa.
                Experimente utilizar outro nome de música,
                artista ou álbum.
              </p>

              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-6 px-5 py-2.5 rounded-xl accent-bg accent-hover text-white font-semibold transition-all"
              >
                Nova pesquisa
              </button>

            </div>
          )}

          {/* ESTADO INICIAL */}
          {!loading && !hasSearched && (
            <div className="bg-[#1e293b] border border-gray-700/70 rounded-2xl py-16 px-6 text-center">

              <div className="relative w-20 h-20 mx-auto mb-6">

                <div className="absolute inset-0 rounded-2xl accent-soft-bg rotate-6" />

                <div className="relative w-full h-full rounded-2xl bg-[#101827] border border-gray-700 flex items-center justify-center">

                  <Music2
                    size={38}
                    className="accent-text"
                  />

                </div>

              </div>

              <h3 className="text-xl font-bold mb-2">
                Sua próxima descoberta está aqui!
              </h3>

              <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                Utilize a barra de pesquisa acima para encontrar
                suas músicas favoritas, conhecer novos artistas
                e explorar diferentes álbuns.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-7">

                <span className="flex items-center gap-2 text-xs text-gray-400 bg-[#101827] border border-gray-700/70 px-3 py-2 rounded-full">
                  <Music2 size={14} className="accent-text" />
                  Músicas
                </span>

                <span className="flex items-center gap-2 text-xs text-gray-400 bg-[#101827] border border-gray-700/70 px-3 py-2 rounded-full">
                  <Disc3 size={14} className="accent-text" />
                  Álbuns
                </span>

                <span className="flex items-center gap-2 text-xs text-gray-400 bg-[#101827] border border-gray-700/70 px-3 py-2 rounded-full">
                  <Sparkles size={14} className="accent-text" />
                  Artistas
                </span>

              </div>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}
