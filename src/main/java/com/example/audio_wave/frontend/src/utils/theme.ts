
export const STORAGE_KEY = 'audiowave-theme';

export const DEFAULT_COLOR = '#8B5CF6';

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function isValidThemeColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color);
}

export function getSavedTheme(): string {
  try {
    const savedColor = localStorage.getItem(STORAGE_KEY);

    return savedColor && isValidThemeColor(savedColor)
      ? savedColor
      : DEFAULT_COLOR;
  } catch {
    return DEFAULT_COLOR;
  }
}

function getRgbValues(hex: string) {
  const normalizedColor = hex.replace('#', '');

  return {
    r: parseInt(normalizedColor.substring(0, 2), 16),
    g: parseInt(normalizedColor.substring(2, 4), 16),
    b: parseInt(normalizedColor.substring(4, 6), 16),
  };
}

function lightenColor(hex: string): string {
  const { r, g, b } = getRgbValues(hex);

  const lighten = (channel: number) =>
    Math.round(channel + (255 - channel) * 0.25);

  return `#${[lighten(r), lighten(g), lighten(b)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function applyTheme(color: string): void {
  if (!isValidThemeColor(color)) {
    console.warn('Cor de tema inválida:', color);
    return;
  }

  const root = document.documentElement;
  const { r, g, b } = getRgbValues(color);
  const hoverColor = lightenColor(color);

  root.style.setProperty('--accent-primary', color);
  root.style.setProperty('--accent-hover', hoverColor);

  // Mantém o gradiente sincronizado com o tema.
  root.style.setProperty('--accent-cyan', hoverColor);

  // Utilizado em fundos e sombras transparentes.
  root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
}

export function saveTheme(color: string): void {
  if (!isValidThemeColor(color)) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, color);
  } catch (error) {
    console.error('Erro ao salvar o tema:', error);
  }
}
