import { useEffect, useState } from 'react';
import { Palette, Check, RotateCcw } from 'lucide-react';
import {getSavedTheme,saveTheme,} from '../utils/theme';

interface ThemeColor {
  name: string;
  primary: string;
  hover: string;
}

const THEME_COLORS: ThemeColor[] = [
  { name: 'Roxo', primary: '#8B5CF6', hover: '#A78BFA' },
  { name: 'Azul', primary: '#3B82F6', hover: '#60A5FA' },
  { name: 'Verde', primary: '#22C55E', hover: '#4ADE80' },
  { name: 'Vermelho', primary: '#EF4444', hover: '#F87171' },
  { name: 'Rosa', primary: '#EC4899', hover: '#F472B6' },
  { name: 'Laranja', primary: '#F97316', hover: '#FB923C' },
];


const DEFAULT_COLOR = '#8B5CF6';

function getHoverColor(hex: string): string {
  const value = hex.replace('#', '');

  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);

  const lighten = (channel: number) =>
    Math.round(channel + (255 - channel) * 0.25);

  return `#${[lighten(r), lighten(g), lighten(b)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

function applyTheme(color: string) {
  const root = document.documentElement;

  const normalizedColor = color.replace('#', '');

  const r = parseInt(normalizedColor.substring(0, 2), 16);
  const g = parseInt(normalizedColor.substring(2, 4), 16);
  const b = parseInt(normalizedColor.substring(4, 6), 16);

  root.style.setProperty('--accent-primary', color);
  root.style.setProperty('--accent-hover', getHoverColor(color));
  root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
}

export function Settings() {
  const [selectedColor, setSelectedColor] = useState(getSavedTheme());

  useEffect(() => {
    const savedColor = getSavedTheme();

    setSelectedColor(savedColor);
    applyTheme(savedColor);
  }, []);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    applyTheme(color);
    saveTheme(color);
  };

  const handleReset = () => {
    handleColorChange(DEFAULT_COLOR);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Palette size={28} className="accent-text" />
          <h1 className="text-3xl font-bold text-white">
            Configurações
          </h1>
        </div>

        <p className="text-gray-400">
          Personalize sua experiência no AudioWave.
        </p>
      </div>

      <section className="bg-[#161B26] border border-gray-800 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Aparência
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Escolha a cor de destaque da interface.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {THEME_COLORS.map((color) => {
            const isSelected = selectedColor === color.primary;

            return (
              <button
                key={color.name}
                onClick={() => handleColorChange(color.primary)}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-white/50 bg-white/5'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: color.primary }}
                >
                  {isSelected && <Check size={18} color="white" />}
                </span>

                <span className="text-white font-medium">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-gray-700 pt-6 space-y-3">
          <label
            htmlFor="custom-color"
            className="block text-white font-medium"
          >
            Ou escolha uma cor personalizada
          </label>

          <div className="flex items-center gap-4">
            <input
              id="custom-color"
              type="color"
              value={selectedColor}
              onChange={(event) => handleColorChange(event.target.value)}
              className="w-14 h-12 rounded-lg cursor-pointer bg-transparent"
            />

            <div>
              <p className="text-white font-medium">
                Cor selecionada
              </p>
              <p className="text-gray-400 text-sm uppercase">
                {selectedColor}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 space-y-4">
          <h3 className="text-white font-medium">
            Pré-visualização
          </h3>

          <div className="bg-[#0B0E14] border border-gray-700 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">
                AudioWave
              </span>

              <Palette
                size={22}
                style={{ color: selectedColor }}
              />
            </div>

            <p className="text-gray-400 text-sm">
              Sua música, sua identidade.
            </p>

            <button
              className="px-5 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: selectedColor }}
            >
              Reproduzir música
            </button>

            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full w-2/3 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-700 pt-5">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
            Restaurar padrão
          </button>
        </div>
      </section>
    </div>
  );
}

export default Settings;
