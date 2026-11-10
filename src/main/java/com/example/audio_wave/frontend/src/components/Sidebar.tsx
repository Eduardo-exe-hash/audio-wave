import React from 'react';
import { Home, Compass, Heart, Library, Radio, LogOut } from 'lucide-react';

interface SidebarProps {
  currentTab: 'home' | 'favorites';
  onNavigate: (tab: 'home' | 'favorites') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate, onLogout }) => {
  return (
    <aside className="w-64 bg-[var(--bg-surface)] h-screen fixed left-0 top-0 p-6 flex flex-col justify-between border-r border-gray-800">
      <div>
        {/* Logo AudioWave */}
        <div className="flex items-center gap-2 mb-8 text-[var(--accent-primary)] font-bold text-xl tracking-wide">
          <Radio className="w-7 h-7" />
          <span>AudioWave</span>
        </div>

        {/* Links Principais */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-left cursor-pointer ${
              currentTab === 'home'
                ? 'text-white bg-[var(--bg-surface-hover)]'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Home className="w-5 h-5 text-[var(--accent-primary)]" />
            Início
          </button>

          <button
            onClick={() => onNavigate('favorites')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition text-left cursor-pointer ${
              currentTab === 'favorites'
                ? 'text-white bg-[var(--bg-surface-hover)]'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-hover)]'
            }`}
          >
            <Heart className="w-5 h-5" />
            Favoritos
          </button>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-hover)] transition"
          >
            <Compass className="w-5 h-5" />
            Descobrir
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-hover)] transition"
          >
            <Library className="w-5 h-5" />
            Sua Biblioteca
          </a>
        </nav>
      </div>

      {/* Botão Sair mantido dentro do aside */}
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer w-full text-left mt-auto"
      >
        <LogOut className="w-5 h-5" />
        Sair
      </button>
    </aside>
  );
};