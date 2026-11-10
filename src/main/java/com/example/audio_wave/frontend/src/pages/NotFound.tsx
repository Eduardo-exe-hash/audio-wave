
import { useNavigate } from 'react-router-dom';
import { Music2, Home, ArrowLeft, AudioWaveform } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#101827] text-white flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* ELEMENTOS DECORATIVOS DE FUNDO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 accent-glow rounded-full blur-[120px] opacity-30 -top-32 -left-32" />

        <div className="absolute w-96 h-96 accent-glow rounded-full blur-[120px] opacity-20 -bottom-32 -right-32" />

        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative z-10 w-full max-w-2xl text-center">

        {/* ÍCONE */}
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20 rounded-3xl accent-soft-bg border flex items-center justify-center shadow-xl accent-shadow">
            <Music2 size={38} className="accent-text" />

            <div className="absolute -top-2 -right-2 w-6 h-6 accent-bg rounded-full flex items-center justify-center border-4 border-[#101827]">
              <span className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* ERRO 404 */}
        <div className="mb-6">
          <h1 className="text-[110px] sm:text-[150px] leading-none font-black tracking-tighter accent-gradient-text select-none">
            404
          </h1>
        </div>

        {/* MENSAGEM */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full accent-soft-bg border text-sm font-semibold">
            <span className="w-2 h-2 rounded-full accent-dot animate-pulse" />
            ERRO 404 · PÁGINA NÃO ENCONTRADA
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Parece que essa música saiu da playlist!
          </h2>

          <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            A página que você está procurando não existe ou foi movida.
            Que tal voltar e continuar aproveitando suas músicas?
          </p>
        </div>

        {/* BOTÕES */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 accent-bg accent-hover rounded-xl font-semibold text-white transition-all duration-300 accent-shadow-hover hover:-translate-y-1 active:scale-95 accent-focus"
          >
            <Home size={19} />
            Voltar ao início
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1e293b] border border-gray-700 hover:border-gray-500 rounded-xl font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            <ArrowLeft size={19} />
            Voltar à página anterior
          </button>

        </div>

        {/* IDENTIDADE DO SISTEMA */}
        <div className="mt-16 pt-6 border-t border-gray-800/80">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <AudioWaveform size={20} className="accent-text" />

            <span className="text-sm font-semibold tracking-wide">
              AudioWave
            </span>
          </div>

          <p className="text-gray-600 text-xs mt-2">
            Sua música, sua identidade.
          </p>
        </div>

      </main>
    </div>
  );
}

export default NotFound;
