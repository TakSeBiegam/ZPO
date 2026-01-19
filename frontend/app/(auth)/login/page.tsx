'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { refetch } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setEmail(localStorage.getItem('login_email') ?? '');
    setPassword(localStorage.getItem('login_password') ?? '');
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setError('Błędne dane logowania.');
    } else {
      await refetch(); // Odśwież cache użytkownika
      router.push('/'); // Przekieruj na stronę główną
    }
  };

  const onOAuthSignIn = async (provider: 'google' | 'github') => {
    setError('');
    try {
      const csrfResponse = await fetch('/api/auth/csrf', {
        credentials: 'include',
      });
      if (!csrfResponse.ok) {
        setError('Nie udało się rozpocząć logowania (CSRF).');
        return;
      }
      const { csrfToken } = (await csrfResponse.json()) as { csrfToken?: string };
      if (!csrfToken) {
        setError('Nie udało się rozpocząć logowania (CSRF).');
        return;
      }

      const signInResponse = await fetch(`/api/auth/signin/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Auth-Return-Redirect': '1',
        },
        credentials: 'include',
        body: new URLSearchParams({
          csrfToken,
          callbackUrl: '/',
        }),
      });

      const data = (await signInResponse.json()) as { url?: string };
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setError('Nie udało się rozpocząć logowania.');
    } catch (err) {
      console.error('OAuth sign-in error:', err);
      setError('Nie udało się rozpocząć logowania.');
    }
  };

  return (
    <div className="card">
      <h2>Logowanie</h2>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input
          className="input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            localStorage.setItem('login_email', e.target.value);
          }}
        />
        <label>Hasło</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            localStorage.setItem('login_password', e.target.value);
          }}
        />
        <button className="button" type="submit">Zaloguj</button>
      </form>
      
      <div style={{ margin: '20px 0', textAlign: 'center', color: '#666' }}>lub</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          className="button" 
          type="button"
          onClick={() => {
            onOAuthSignIn('google');
          }}
          style={{ background: '#4285f4', color: 'white' }}
        >
          Zaloguj przez Google
        </button>
        <button 
          className="button" 
          type="button"
          onClick={() => {
            onOAuthSignIn('github');
          }}
          style={{ background: '#333', color: 'white' }}
        >
          Zaloguj przez GitHub
        </button>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/register" style={{ color: 'var(--color-primary)' }}>Nie masz konta? Zarejestruj się</a>
      </div>
    </div>
  );
}
