import React, { useState } from 'react';
import {Radio ,Lock ,Mail ,AlertCircle ,Eye ,EyeOff ,LoaderCircle} from 'lucide-react';
import { Link } from 'react-router-dom';
import { login } from '../services/authService';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError(null);

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);

      await login({
        email: normalizedEmail,
        password,
      });

      onLoginSuccess();
    } catch (err: unknown) {
      console.error('Erro de login:', err);

      const status =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof err.response === 'object' &&
        err.response !== null &&
        'status' in err.response
          ? err.response.status
          : undefined;

      if (status === 401) {
        setError('E-mail ou senha inválidos.');
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'w-full h-12 bg-[#0C1018] border border-[#252D3D] ' +
    'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 ' +
    'rounded-xl text-white text-sm placeholder:text-slate-600 ' +
    'outline-none transition-all duration-200';

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#090B10] flex items-center justify-center p-4 sm:p-6">

      {/* Iluminação decorativa de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] max-w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.08] blur-[110px]"
      />

      {/* Card de login */}
      <section className="w-full max-w-md">

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#171C29] to-[#111621] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] sm:p-8">

          {/* Detalhe decorativo superior */}
          <div
            aria-hidden="true"
            className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent"
          />

          {/* Logo e título */}
          <header className="mb-8 flex flex-col items-center text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-purple-700/10 text-violet-400 shadow-[0_0_35px_rgba(139,92,246,0.12)]">

              <Radio
                className="h-8 w-8"
                strokeWidth={2}
                aria-hidden="true"
              />

            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              AudioWave
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Entre na sua conta para continuar
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Ainda não possui uma conta?{' '}
              <Link
                to="/register"
                className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
              >
                Cadastre-se
              </Link>
            </p>

            <div
              aria-hidden="true"
              className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-400"
            />

          </header>

          {/* Mensagem de erro */}
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-3.5 text-sm text-red-300"
            >

              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                aria-hidden="true"
              />

              <span className="leading-5">
                {error}
              </span>

            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* E-mail */}
            <div>

              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                E-mail
              </label>

              <div className="relative">

                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="seu@email.com"
                  required
                  disabled={loading}
                  aria-invalid={!!error}
                  style={{ paddingLeft: '48px', paddingRight: '16px' }}
                  className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-60`}
                />

              </div>

            </div>

            {/* Senha */}
            <div>

              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Senha
              </label>

              <div className="relative">

                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />

                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                  aria-invalid={!!error}
                  style={{ paddingLeft: '48px', paddingRight: '48px' }}
                  className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-60`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={loading}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>

              </div>

            </div>

            {/* Botão de login */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition-all duration-200 hover:bg-violet-400 hover:shadow-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151A26] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-violet-500"
            >

              {loading ? (
                <>
                  <LoaderCircle
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar</span>
              )}

            </button>

          </form>

          {/* Rodapé do card */}
          <footer className="mt-7 border-t border-white/[0.06] pt-5 text-center">

            <p className="text-xs text-slate-500">
              AudioWave
              <span className="mx-2 text-slate-700">•</span>
              Sua experiência sonora em um só lugar
            </p>

          </footer>

        </div>

        {/* Rodapé externo */}
        <p className="mt-5 text-center text-xs text-slate-600">
          Acesse sua conta com segurança.
        </p>

      </section>

    </main>
  );
};
