
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './App.css';

import App from './App.tsx';

import { applyTheme, getSavedTheme } from './utils/theme';

// Aplica o tema salvo antes de renderizar a interface.
applyTheme(getSavedTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
