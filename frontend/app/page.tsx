'use client';

import Notifications from '../components/Notifications';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../contexts/UserContext';

type Post = { 
  id: number; 
  title: string; 
  content: string; 
  createdAt: string;
  author: { name: string | null; email: string };
};

export default function Home() {
  const { user, isLoggedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const isAdmin = isLoggedIn && user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  useEffect(() => {
    fetch('http://localhost:3001/posts?status=APPROVED')
      .then((r) => r.json())
      .then((data) => {
        // Sortuj po dacie (najnowsze pierwsze) i weź 5 ostatnich
        const sorted = data.sort((a: Post, b: Post) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
        setPosts(sorted);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="grid grid-2">
        <div className="card">
          <h2>Witamy w księgarni</h2>
          <p>Minimalny projekt zgodny z wymaganiami.</p>
        </div>
        <div className="card">
          <h2>Powiadomienia</h2>
          <Notifications />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Najnowsze posty</h2>
        {posts.length === 0 ? (
          <div className="card">
            <p>Brak postów do wyświetlenia.</p>
            {isAdmin && (
              <p>
                <Link href="/admin/create-post" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                  Utwórz pierwszy post
                </Link>
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-2">
            {posts.map((post) => (
              <Link 
                href={`/posts/${post.id}`} 
                key={post.id} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <h3>{post.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    Autor: {post.author.name || post.author.email} • {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                  </p>
                  <p>{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
                  <span style={{ color: '#0066cc', fontSize: '0.9rem' }}>Czytaj więcej →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
