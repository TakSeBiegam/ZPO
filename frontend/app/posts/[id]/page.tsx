'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';

type Post = {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  author: { name: string | null; email: string };
  category?: { name: string };
};

type Comment = {
  id: number;
  content: string;
  status: string;
  createdAt: string;
  author: { name: string | null; email: string };
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading, isLoggedIn } = useUser();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPending, setShowPending] = useState(false);

  const postId = params.id as string;
  const isAdmin = isLoggedIn && user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      const res = await fetch(`http://localhost:3001/posts?status=APPROVED`);
      const posts = await res.json();
      const foundPost = posts.find((p: Post) => p.id === Number(postId));
      setPost(foundPost || null);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch(`http://localhost:3001/posts/${postId}/comments?status=APPROVED`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
      
      // Jeśli admin, pobierz też pending
      if (isAdmin) {
        const pendingRes = await fetch(`http://localhost:3001/posts/${postId}/comments?status=PENDING`);
        if (pendingRes.ok) {
          const pendingData = await pendingRes.json();
          setPendingComments(pendingData);
        }
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    const res = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: commentContent }),
    });

    if (res.ok) {
      alert('Komentarz dodany! ' + (isAdmin ? 'Pojawi się w sekcji oczekujących.' : 'Oczekuje na zatwierdzenie.'));
      setCommentContent('');
      loadComments();
    } else {
      alert('Błąd podczas dodawania komentarza. Upewnij się, że jesteś zalogowany.');
    }
  };

  const approveComment = async (commentId: number) => {
    const res = await fetch(`http://localhost:3001/posts/comments/${commentId}/approve`, {
      method: 'PATCH',
      credentials: 'include',
    });
    if (res.ok) {
      alert('Komentarz zatwierdzony!');
      loadComments();
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!confirm('Czy na pewno usunąć ten komentarz?')) return;
    
    const res = await fetch(`http://localhost:3001/posts/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      alert('Komentarz usunięty!');
      loadComments();
    }
  };

  const approvePost = async () => {
    const res = await fetch(`http://localhost:3001/posts/${postId}/approve`, {
      method: 'PATCH',
      credentials: 'include',
    });
    if (res.ok) {
      alert('Post zatwierdzony!');
      loadPost();
    }
  };

  const deletePost = async () => {
    if (!confirm('Czy na pewno usunąć ten post?')) return;
    
    // Uwaga: endpoint delete nie jest zaimplementowany w backendzie
    alert('Funkcja usuwania postów nie jest jeszcze dostępna.');
  };

  if (loading) return <div>Ładowanie...</div>;

  if (!post) {
    return (
      <div>
        <h2>Post nie znaleziony</h2>
        <div className="card">
          <p>Post o podanym ID nie istnieje lub nie został jeszcze zatwierdzony.</p>
          <button className="button" onClick={() => router.push('/')}>
            ← Powrót do strony głównej
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button 
        className="button" 
        onClick={() => router.push('/')}
        style={{ marginBottom: '1rem', background: '#6c757d' }}
      >
        ← Powrót
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ marginBottom: '0.5rem' }}>{post.title}</h1>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Autor: {post.author.name || post.author.email} • 
              {new Date(post.createdAt).toLocaleDateString('pl-PL', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              {post.category && ` • Kategoria: ${post.category.name}`}
            </p>
          </div>
          
          {isAdmin && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {post.status === 'PENDING' && (
                <button 
                  className="button" 
                  onClick={approvePost}
                  style={{ background: '#28a745' }}
                >
                  ✓ Zatwierdź
                </button>
              )}
              <button 
                className="button" 
                onClick={deletePost}
                style={{ background: '#dc3545' }}
              >
                🗑️ Usuń
              </button>
            </div>
          )}
        </div>

        <div style={{ 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid #ddd',
          lineHeight: '1.6'
        }}
        dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.status === 'PENDING' && isAdmin && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#fff3cd', 
            borderRadius: '4px' 
          }}>
            ⚠️ Ten post oczekuje na zatwierdzenie
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Komentarze ({comments.length})</h2>
        
        {isAdmin && pendingComments.length > 0 && (
          <div className="card" style={{ backgroundColor: '#fff3cd', borderColor: '#ffc107', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>⚠️ Komentarze oczekujące na zatwierdzenie: {pendingComments.length}</strong>
              <button 
                className="button"
                onClick={() => setShowPending(!showPending)}
                style={{ background: '#ffc107', color: '#000' }}
              >
                {showPending ? 'Ukryj' : 'Pokaż'} oczekujące
              </button>
            </div>
          </div>
        )}

        {isAdmin && showPending && pendingComments.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3>Komentarze do moderacji</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingComments.map((comment) => (
                <div className="card" key={comment.id} style={{ borderLeft: '4px solid #ffc107' }}>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    <strong>{comment.author.name || comment.author.email}</strong> • 
                    {new Date(comment.createdAt).toLocaleDateString('pl-PL')} • 
                    <span style={{ color: '#ffc107', fontWeight: 'bold' }}>OCZEKUJE</span>
                  </p>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      className="button" 
                      onClick={() => approveComment(comment.id)}
                      style={{ background: '#28a745' }}
                    >
                      ✓ Zatwierdź
                    </button>
                    <button 
                      className="button" 
                      onClick={() => deleteComment(comment.id)}
                      style={{ background: '#dc3545' }}
                    >
                      🗑️ Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isLoggedIn ? (
          <div className="card">
            <h3>Dodaj komentarz</h3>
            <form onSubmit={addComment}>
              <textarea
                className="input"
                placeholder="Twój komentarz..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={4}
                required
              />
              <button className="button" type="submit">
                Wyślij komentarz
              </button>
              <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
                {isAdmin 
                  ? 'Twój komentarz będzie widoczny od razu po zatwierdzeniu w sekcji moderacji.' 
                  : 'Komentarz będzie widoczny po zatwierdzeniu przez moderatora.'}
              </small>
            </form>
          </div>
        ) : (
          <div className="card">
            <p>
              <a href="/login" style={{ color: '#0066cc', textDecoration: 'underline' }}>
                Zaloguj się
              </a>
              {' '}aby dodać komentarz.
            </p>
          </div>
        )}

        {comments.length === 0 ? (
          <div className="card">
            <p>Brak komentarzy. Bądź pierwszą osobą, która skomentuje ten post!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {comments.map((comment) => (
              <div className="card" key={comment.id}>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <strong>{comment.author.name || comment.author.email}</strong> • 
                  {new Date(comment.createdAt).toLocaleDateString('pl-PL')}
                </p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                {isAdmin && (
                  <button 
                    className="button" 
                    onClick={() => deleteComment(comment.id)}
                    style={{ background: '#dc3545', marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                  >
                    🗑️ Usuń
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
