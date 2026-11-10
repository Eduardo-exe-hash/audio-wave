import React, { useState } from 'react';
import {Radio,Lock,Mail,AlertCircle,Eye,EyeOff,LoaderCircle,CheckCircle2} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClassName =
    'w-full h-12 bg-[#0C1018] border border-[#252D3D] ' +
    'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 ' +
    'rounded-xl text-white text-sm placeholder:text-slate-600 ' +
    'outline-none transition-all duration-200';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setError(null);
    setSuccess(false);

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve possuir pelo menos 8 caracteres.');
      return;
    }

    try {
      setLoading(true);

      await register({
        email: normalizedEmail,
        password
      });

      setSuccess(true);

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);

    } catch (err: unknown) {
      console.error('Erro no cadastro:', err);

      const status =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof err.response === 'object' &&
        err.response !== null &&
        'status' in err.response
          ? err.response.status
          : undefined;

      if (status === 400) {
        setError('Este e-mail já está cadastrado ou os dados são inválidos.');
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#090B10] flex items-center justify-center p-4 sm:p-6">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] max-w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/[0.08] blur-[110px]"
      />

      <section className="w-full max-w-md">

        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#171C29] to-[#111621] p-6 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] sm:p-8">

          <div
            aria-hidden="true"
            className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent"
          />

          <header className="mb-8 flex flex-col items-center text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-purple-700/10 text-violet-400 shadow-[0_0_35px_rgba(139,92,246,0.12)]">

              <Radio className="h-8 w-8" strokeWidth={2} />

            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              AudioWave
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Crie sua conta e comece a explorar
            </p>

            <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-400" />

          </header>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] p-3.5 text-sm text-red-300"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <span className="leading-5">{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-5 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/[0.08] p-3.5 text-sm text-green-300"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>Conta criada com sucesso! Redirecionando para o login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* E-mail */}
            <div>
              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                E-mail
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="seu@email.com"
                  required
                  disabled={loading || success}
                  style={{ paddingLeft: '48px', paddingRight: '16px' }}
                  className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-60`}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Senha
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Crie uma senha"
                  required
                  minLength={8}
                  disabled={loading || success}
                  style={{ paddingLeft: '48px', paddingRight: '48px' }}
                  className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-60`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || success}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-violet-400"
                >
                  {showPassword
                    ? <EyeOff className="h-5 w-5" />
                    : <Eye className="h-5 w-5" />
                  }
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Mínimo de 8 caracteres.
              </p>
            </div>

            {/* Confirmar senha */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Confirmar senha
              </label>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Digite sua senha novamente"
                  required
                  disabled={loading || success}
                  style={{ paddingLeft: '48px', paddingRight: '48px' }}
                  className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-60`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading || success}
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-violet-400"
                >
                  {showConfirmPassword
                    ? <EyeOff className="h-5 w-5" />
                    : <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
            </div>

            {/* Botão de cadastro */}
            <button
              type="submit"
              disabled={loading || success}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition-all duration-200 hover:bg-violet-400 hover:shadow-violet-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151A26] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  <span>Criando conta...</span>
                </>
              ) : (
                <span>Criar conta</span>
              )}
            </button>

          </form>

          <footer className="mt-7 border-t border-white/[0.06] pt-5 text-center">

            <p className="text-sm text-slate-400">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="font-semibold text-violet-400 transition-colors hover:text-violet-300"
              >
                Entrar
              </Link>
            </p>

          </footer>

        </div>

        <p className="mt-5 text-center text-xs text-slate-600">
          AudioWave • Sua experiência sonora em um só lugar
        </p>

      </section>
    </main>
  );
};
