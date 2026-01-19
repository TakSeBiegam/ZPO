'use client';

import Link from 'next/link';
import { useUser } from '../contexts/UserContext';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const { user, isLoggedIn } = useUser();
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isAdmin = isLoggedIn && user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAdminMenu(false);
      }
    };

    if (showAdminMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdminMenu]);

  return (
    <header>
      <div className="container">
        <h1>Księgarnia</h1>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/">Start</Link>
            <Link href="/products">Księgozbiór</Link>
            <Link href="/gallery">Galeria</Link>
            <Link href="/cart">Koszyk</Link>
            <Link href="/orders">Zamówienia</Link>
            <Link href="/profile">Profil</Link>
            <Link href="/login">Logowanie</Link>
          </div>
          
          {isAdmin && (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button 
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                style={{ 
                  background: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Admin ▾
              </button>
              {showAdminMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '0.5rem',
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  zIndex: 1000
                }}>
                  <Link 
                    href="/admin/create-post" 
                    onClick={() => setShowAdminMenu(false)}
                    style={{ 
                      display: 'block', 
                      padding: '0.75rem 1rem', 
                      color: '#333',
                      textDecoration: 'none',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    ✏️ Utwórz post
                  </Link>
                  <Link 
                    href="/moderation" 
                    onClick={() => setShowAdminMenu(false)}
                    style={{ 
                      display: 'block', 
                      padding: '0.75rem 1rem', 
                      color: '#333',
                      textDecoration: 'none',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    🛡️ Moderacja
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link 
                      href="/admin/themes" 
                      onClick={() => setShowAdminMenu(false)}
                      style={{ 
                        display: 'block', 
                        padding: '0.75rem 1rem', 
                        color: '#333',
                        textDecoration: 'none'
                      }}
                    >
                      🎨 Motywy
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
