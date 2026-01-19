'use client';

import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    const applyTheme = async () => {
      try {
        const res = await fetch('http://localhost:3001/users/me/theme', {
          credentials: 'include',
        });
        
        if (res.ok) {
          const theme = await res.json();
          if (theme) {
            document.documentElement.style.setProperty('--color-primary', theme.colorPrimary);
            document.documentElement.style.setProperty('--color-secondary', theme.colorSecondary);
            document.documentElement.style.setProperty('--color-accent', theme.colorAccent);
          }
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };

    applyTheme();
  }, []);

  return null;
}
