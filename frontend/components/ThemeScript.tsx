'use client';

import { useEffect } from 'react';

const theme = {
  primary: '#2b5d7c',
  secondary: '#d9a441',
  accent: '#bf3b3b',
};

export default function ThemeScript() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
  }, []);

  return null;
}
