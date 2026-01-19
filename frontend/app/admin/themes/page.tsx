'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Theme {
  id: number;
  name: string;
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  isDefault: boolean;
}

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [name, setName] = useState('');
  const [colorPrimary, setColorPrimary] = useState('#2b5d7c');
  const [colorSecondary, setColorSecondary] = useState('#d9a441');
  const [colorAccent, setColorAccent] = useState('#bf3b3b');
  const [isDefault, setIsDefault] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  const fetchThemes = async () => {
    const res = await fetch('http://localhost:3001/themes', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setThemes(data);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3001/themes/${editingId}`
      : 'http://localhost:3001/themes';
    const method = editingId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, colorPrimary, colorSecondary, colorAccent, isDefault }),
    });

    if (res.ok) {
      setName('');
      setColorPrimary('#2b5d7c');
      setColorSecondary('#d9a441');
      setColorAccent('#bf3b3b');
      setIsDefault(false);
      setEditingId(null);
      fetchThemes();
    } else {
      const err = await res.json();
      alert(err.message || 'Błąd podczas zapisywania motywu');
    }
  };

  const handleEdit = (theme: Theme) => {
    setEditingId(theme.id);
    setName(theme.name);
    setColorPrimary(theme.colorPrimary);
    setColorSecondary(theme.colorSecondary);
    setColorAccent(theme.colorAccent);
    setIsDefault(theme.isDefault);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten motyw?')) return;

    const res = await fetch(`http://localhost:3001/themes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      fetchThemes();
    } else {
      const err = await res.json();
      alert(err.message || 'Błąd podczas usuwania motywu');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName('');
    setColorPrimary('#2b5d7c');
    setColorSecondary('#d9a441');
    setColorAccent('#bf3b3b');
    setIsDefault(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Zarządzanie motywami</h1>
      <p style={{ marginBottom: '2rem' }}>
        Tutaj możesz tworzyć i edytować motywy kolorystyczne aplikacji.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Form */}
        <div style={{ border: '1px solid var(--color-primary)', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>{editingId ? 'Edytuj motyw' : 'Utwórz nowy motyw'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nazwa motywu:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Kolor podstawowy (Primary):
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={colorPrimary}
                  onChange={(e) => setColorPrimary(e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={colorPrimary}
                  onChange={(e) => setColorPrimary(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Kolor drugorzędny (Secondary):
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={colorSecondary}
                  onChange={(e) => setColorSecondary(e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={colorSecondary}
                  onChange={(e) => setColorSecondary(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Kolor akcentu (Accent):
              </label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={colorAccent}
                  onChange={(e) => setColorAccent(e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={colorAccent}
                  onChange={(e) => setColorAccent(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                />
                Ustaw jako motyw domyślny
              </label>
            </div>

            {/* Preview */}
            <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Podgląd:</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: colorPrimary,
                    border: '1px solid #000',
                    borderRadius: '4px',
                  }}
                  title="Primary"
                />
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: colorSecondary,
                    border: '1px solid #000',
                    borderRadius: '4px',
                  }}
                  title="Secondary"
                />
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: colorAccent,
                    border: '1px solid #000',
                    borderRadius: '4px',
                  }}
                  title="Accent"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}>
                {editingId ? 'Zapisz zmiany' : 'Utwórz motyw'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    fontSize: '1rem',
                    backgroundColor: '#666',
                  }}
                >
                  Anuluj
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div>
          <h2>Istniejące motywy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {themes.map((theme) => (
              <div
                key={theme.id}
                style={{
                  border: '1px solid var(--color-primary)',
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: theme.isDefault ? '#f0f8ff' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>
                    {theme.name}
                    {theme.isDefault && <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: 'green' }}>(Domyślny)</span>}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(theme)} style={{ padding: '0.5rem 1rem' }}>
                      Edytuj
                    </button>
                    {!theme.isDefault && (
                      <button
                        onClick={() => handleDelete(theme.id)}
                        style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-accent)', color: 'white' }}
                      >
                        Usuń
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: theme.colorPrimary,
                      border: '1px solid #000',
                      borderRadius: '4px',
                    }}
                    title={`Primary: ${theme.colorPrimary}`}
                  />
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: theme.colorSecondary,
                      border: '1px solid #000',
                      borderRadius: '4px',
                    }}
                    title={`Secondary: ${theme.colorSecondary}`}
                  />
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: theme.colorAccent,
                      border: '1px solid #000',
                      borderRadius: '4px',
                    }}
                    title={`Accent: ${theme.colorAccent}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
