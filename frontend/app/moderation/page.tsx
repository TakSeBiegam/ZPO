'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';

type Post = { id: number; title: string; content: string };
type Comment = { id: number; content: string };

export default function ModerationPage() {
  const { user, isLoading, isLoggedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postId, setPostId] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  const isAuthorized = isLoggedIn && user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  useEffect(() => {
    if (isAuthorized) {
      load();
    }
  }, [isAuthorized]);

  const load = () => {
    fetch('http://localhost:3001/posts?status=PENDING')
      .then((r) => r.json())
      .then(setPosts);
  };

  const approve = async (id: number) => {
    await fetch(`http://localhost:3001/posts/${id}/approve`, {
      method: 'PATCH',
      credentials: 'include',
    });
    load();
  };

  const loadComments = async () => {
    const res = await fetch(`http://localhost:3001/posts/${postId}/comments?status=PENDING`, {
      credentials: 'include',
    });
    if (res.ok) setComments(await res.json());
  };

  const approveComment = async (id: number) => {
    await fetch(`http://localhost:3001/posts/comments/${id}/approve`, {
      method: 'PATCH',
      credentials: 'include',
    });
    loadComments();
  };

  const deleteComment = async (id: number) => {
    if (!confirm('Czy na pewno usunąć ten komentarz?')) return;
    await fetch(`http://localhost:3001/products/comments/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    loadComments();
  };

  if (isLoading) return <div>Ładowanie...</div>;

  if (!isAuthorized) {
    return (
      <div>
        <h2>Moderacja</h2>
        <div className="card">
          <p>Ta sekcja jest dostępna tylko dla administratorów i moderatorów.</p>
          <a href="/login" className="button" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Zaloguj się
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Moderacja postów</h2>
      <div className="grid grid-2">
        {posts.map((post) => (
          <div className="card" key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.content}</p>
            <button className="button" onClick={() => approve(post.id)}>Akceptuj</button>
          </div>
        ))}
      </div>

      <h2>Moderacja komentarzy</h2>
      <div className="card">
        <label>ID posta</label>
        <input className="input" value={postId} onChange={(e) => setPostId(e.target.value)} />
        <button className="button" onClick={loadComments}>Wczytaj komentarze</button>
      </div>
      <div className="grid grid-2">
        {comments.map((comment) => (
          <div className="card" key={comment.id}>
            <p>{comment.content}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="button" onClick={() => approveComment(comment.id)}>Akceptuj</button>
              <button className="button" style={{ background: 'var(--color-accent)' }} onClick={() => deleteComment(comment.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
