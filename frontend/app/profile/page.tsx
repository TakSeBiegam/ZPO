'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';

interface Theme {
  id: number;
  name: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  isDefault: boolean;
}

export default function ProfilePage() {
  const { user, isLoading, isLoggedIn, refetch } = useUser();
  const [name, setName] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
    fetchThemes();
  }, [user]);

  const fetchThemes = async () => {
    const res = await fetch('http://localhost:3001/themes', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setThemes(data);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3001/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, addressLine, city }),
    });
    alert('Profil zaktualizowany');
    refetch();
  };

  const selectTheme = async (themeId: number) => {
    const res = await fetch(`http://localhost:3001/themes/user/select/${themeId}`, {
      method: 'PATCH',
      credentials: 'include',
    });
    if (res.ok) {
      setSelectedThemeId(themeId);
      alert('Motyw został zmieniony. Odśwież stronę, aby zobaczyć zmiany.');
      window.location.reload();
    }
  };

  if (isLoading) return <div>Ładowanie...</div>;

  if (!isLoggedIn) {
    return (
      <div>
        <h2>Profil niedostępny</h2>
        <div className="card">
          <p>Musisz być zalogowany, aby zobaczyć swój profil.</p>
          <a href="/login" className="button" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Zaloguj się
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2>Profil i adres</h2>
        <form onSubmit={save}>
          <input className="input" placeholder="Imię" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Adres" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
          <input className="input" placeholder="Miasto" value={city} onChange={(e) => setCity(e.target.value)} />
          <button className="button" type="submit">Zapisz</button>
        </form>
      </div>

      <div className="card">
        <h2>Motyw kolorystyczny</h2>
        <p style={{ marginBottom: '1rem' }}>Wybierz swój ulubiony motyw kolorystyczny:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {themes.map((theme) => (
            <div
              key={theme.id}
              style={{
                border: '2px solid var(--color-primary)',
                padding: '1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => selectTheme(theme.id)}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>
                {theme.name}
                {theme.isDefault && <span style={{ fontSize: '0.8rem', color: 'green' }}> (Domyślny)</span>}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: theme.colorPrimary,
                    border: '1px solid #000',
                    borderRadius: '4px',
                  }}
                  title="Primary"
                />
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: theme.colorSecondary,
                    border: '1px solid #000',
                    borderRadius: '4px',
                  }}
                  title="Secondary"
                />
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: theme.colorAccent,
                    border: '1px solid #000',
                    borderRadius: '4px',
                  }}
                  title="Accent"
                />
              </div>
              <button
                className="button"
                style={{ width: '100%', padding: '0.5rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  selectTheme(theme.id);
                }}
              >
                Wybierz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
