import { NavLink } from 'react-router-dom';
import {Home,Search,Heart,ListMusic,Sparkles,Settings,Music2,} from 'lucide-react';

const navigationItems = [
  { name: 'Home', path: '/home', icon: Home },
  { name: 'Recomendações', path: '/recommendations', icon: Sparkles },
  { name: 'Buscar', path: '/search', icon: Search },
  { name: 'Favoritos', path: '/favorites', icon: Heart },
  { name: 'Playlists', path: '/playlists', icon: ListMusic },
  { name: 'Configurações', path: '/settings', icon: Settings },
];

export function Navbar() {
  return (
    <nav className="bg-gray-800 text-white border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* Logo */}
        <NavLink to="/home" className="flex items-center gap-2">
          <Music2 size={28} className="accent-text" />
          <span className="text-xl font-bold">
            AudioWave
          </span>
        </NavLink>

        {/* Navegação */}
        <div className="flex flex-wrap justify-center items-center gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'accent-bg text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
