
import { useEffect, useState } from 'react';
import type { Track } from '../types/track';
import { TrackCard } from '../components/TrackCard';
import { fetchGlobalRecommendations } from '../services/recommendationService';

interface RecommendationsProps {
  onPlayTrack: (track: Track) => void;
  onToggleFavorite?: (track: Track) => void;
}

export function Recommendations({
  onPlayTrack,
  onToggleFavorite,
}: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchGlobalRecommendations();

        console.log('Primeira recomendação recebida:', data[0]);
        console.log('Propriedades disponíveis:', Object.keys(data[0] ?? {}));

        const formatted: Track[] = data.map((item: any) => {
          const audioUrl =
            item.audioUrl ??
            item.audio ??
            item.audio_url ??
            item.audio_file ??
            item.audiodownload ??
            item.audio_stream ??
            item.streamurl ??
            '';

          return {
            ...item,

            id: item.id,

            jamendoId: String(
              item.jamendoId || item.id || ''
            ),

            musicTitle:
              item.musicTitle ||
              item.title ||
              item.name ||
              'Sem título',

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
              item.durationSeconds ??
              item.duration ??
              0
            ),

            audioUrl: audioUrl,

            coverImageUrl:
              item.coverImageUrl ||
              item.cover_image_url ||
              item.image ||
              item.album_image ||
              item.album_cover ||
              '',

            isFavorite: Boolean(item.isFavorite),
          };
        });

        setRecommendations(formatted);

      } catch (err) {
        console.error('Erro nas recomendações:', err);
        setError('Não foi possível carregar as recomendações.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[var(--bg-main)] p-6 text-[var(--text-primary)]">
        <div className="mx-auto max-w-[1200px] py-10 text-center">
          <p className="animate-pulse text-[var(--text-secondary)]">
            Carregando recomendações...
          </p>
        </div>
      </main>
    );
  }

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
        space-y-8 px-5 py-10 sm:px-8 lg:px-12 lg:py-14"
      >

        {/* Cabeçalho */}
        <header className="space-y-3">
          <div className="accent-text flex items-center gap-2 text-xs font-semibold
               uppercase tracking-[0.25em]">
            <span className="accent-dot h-1.5 w-1.5 rounded-full" />
            Descubra novos sons
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Recomendadas{' '}
            <span className="accent-gradient-text">
              para Você
            </span>
          </h1>

          <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
            Descubra novas músicas selecionadas para você.
          </p>
        </header>

        {/* Erro */}
        {error && (
          <div className="rounded-xl border border-red-500/30
          bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Recomendações */}
        {!error && recommendations.length > 0 && (
          <>
            <div className="flex items-center justify-between
            border-b border-white/[0.07] pb-4">
              <h2 className="text-lg font-semibold sm:text-xl">
                Sugestões musicais
              </h2>

              <span className="rounded-full border border-white/[0.08]
              bg-[var(--bg-surface)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                {recommendations.length}{' '}
                {recommendations.length === 1 ? 'música' : 'músicas'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5
            sm:grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 2xl:grid-cols-5">

              {recommendations.map((track) => (
                <TrackCard
                  key={track.jamendoId || track.id}
                  track={track}
                  onPlay={onPlayTrack}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}

            </div>
          </>
        )}

        {/* Lista vazia */}
        {!error && recommendations.length === 0 && (
          <div className="flex flex-col items-center justify-center
          rounded-3xl border border-dashed border-white/10
          bg-[var(--bg-surface)] px-6 py-20 text-center">

            <h3 className="text-lg font-semibold">
              Nenhuma recomendação encontrada
            </h3>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Não encontramos músicas para recomendar no momento.
            </p>

          </div>
        )}

      </section>
    </main>
  );
}
