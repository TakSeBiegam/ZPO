'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) setError('Rejestracja nieudana.');
  };

  return (
    <div className="card">
      <h2>Rejestracja</h2>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={onSubmit}>
        <label>Imię</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Hasło</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="button" type="submit">Zarejestruj</button>
      </form>
      
      <div style={{ margin: '20px 0', textAlign: 'center', color: '#666' }}>lub</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          className="button" 
          type="button"
          onClick={() => {
            signIn('google', { callbackUrl: '/', redirect: true });
          }}
          style={{ background: '#4285f4', color: 'white' }}
        >
          Zarejestruj przez Google
        </button>
        <button 
          className="button" 
          type="button"
          onClick={() => {
            signIn('github', { callbackUrl: '/', redirect: true });
          }}
          style={{ background: '#333', color: 'white' }}
        >
          Zarejestruj przez GitHub
        </button>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a href="/login" style={{ color: 'var(--color-primary)' }}>Masz już konto? Zaloguj się</a>
      </div>
    </div>
  );
}
