'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '../../../contexts/UserContext';

type Product = {
  id: number;
  title: string;
  author: string;
  description: string;
  year: number;
  price: number;
  imageUrl?: string;
  category?: { name: string };
};

type Comment = {
  id: number;
  content: string;
  status: string;
  createdAt: string;
  author: { id: number; name: string; email: string };
};

export default function ProductDetailPage() {
  const params = useParams();
  const { user, isLoggedIn } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showPending, setShowPending] = useState(false);

  const isAdmin = isLoggedIn && user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  useEffect(() => {
    if (params?.id) {
      loadProduct();
      loadComments();
    }
  }, [params?.id, isLoggedIn]);

  const loadProduct = async () => {
    const res = await fetch(`http://localhost:3001/products/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setProduct(data);
    }
  };

  const loadComments = async () => {
    try {
      // Pobierz zatwierdzone komentarze + własne oczekujące
      const res = await fetch(`http://localhost:3001/products/${params.id}/comments`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }

      // Jeśli admin, pobierz też wszystkie oczekujące
      if (isAdmin) {
        const pendingRes = await fetch(`http://localhost:3001/products/${params.id}/comments/pending`, {
          credentials: 'include',
        });
        if (pendingRes.ok) {
          const pendingData = await pendingRes.json();
          setPendingComments(pendingData);
        }
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const addToCart = async () => {
    await fetch('http://localhost:3001/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId: product?.id, quantity }),
    });
    alert('Dodano do koszyka');
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const res = await fetch(`http://localhost:3001/products/${params?.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newComment }),
    });
    if (res.ok) {
      setNewComment('');
      alert(isAdmin ? 'Komentarz dodany! Pojawi się w sekcji oczekujących.' : 'Komentarz wysłany do akceptacji. Zobaczysz go poniżej po odświeżeniu.');
      loadComments();
    }
  };

  const approveComment = async (commentId: number) => {
    const res = await fetch(`http://localhost:3001/products/comments/${commentId}/approve`, {
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
    const res = await fetch(`http://localhost:3001/products/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      alert('Komentarz usunięty!');
      loadComments();
    }
  };

  if (!product) return <div>Ładowanie...</div>;

  return (
    <div>
      <a href="/products" style={{ color: 'var(--color-primary)', marginBottom: '16px', display: 'inline-block' }}>
        ← Powrót do księgozbioru
      </a>
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            )}
          </div>
          <div>
            <h1 style={{ marginTop: 0 }}>{product.title}</h1>
            <p style={{ fontSize: '1.1em', color: '#555' }}>
              <strong>Autor:</strong> {product.author}
            </p>
            <p style={{ fontSize: '1em', color: '#666' }}>
              <strong>Rok wydania:</strong> {product.year}
            </p>
            {product.category && (
              <p style={{ fontSize: '1em', color: '#666' }}>
                <strong>Kategoria:</strong> {product.category.name}
              </p>
            )}
            <p style={{ fontSize: '1em', marginTop: '16px', lineHeight: 1.6 }}>{product.description}</p>
            <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '24px' }}>
              {(product.price / 100).toFixed(2)} zł
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
              <label>Ilość:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: '80px', padding: '8px' }}
              />
              <button className="button" onClick={addToCart} style={{ flex: 1 }}>
                Dodaj do koszyka
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '900px', margin: '24px auto 0' }}>
        <h2>Komentarze ({comments.length})</h2>

        {isAdmin && pendingComments.length > 0 && (
          <div style={{ backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingComments.map((comment) => (
                <div key={comment.id} className="card" style={{ background: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
                  <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                    <strong>{comment.author.name || comment.author.email}</strong> •{' '}
                    {new Date(comment.createdAt).toLocaleDateString('pl-PL')} •{' '}
                    <span style={{ color: '#ffc107', fontWeight: 'bold' }}>OCZEKUJE</span>
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '1em' }}>{comment.content}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      className="button" 
                      onClick={() => approveComment(comment.id)}
                      style={{ background: '#28a745', padding: '0.5rem 1rem' }}
                    >
                      ✓ Zatwierdź
                    </button>
                    <button 
                      className="button" 
                      onClick={() => deleteComment(comment.id)}
                      style={{ background: '#dc3545', padding: '0.5rem 1rem' }}
                    >
                      🗑️ Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isLoggedIn && (
          <form onSubmit={submitComment} style={{ marginBottom: '24px' }}>
            <textarea
              className="input"
              placeholder="Napisz komentarz..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              style={{ marginBottom: '8px' }}
              required
            />
            <button className="button" type="submit">Dodaj komentarz</button>
            <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
              {isAdmin 
                ? 'Twój komentarz pojawi się w sekcji moderacji.' 
                : 'Komentarz będzie widoczny dla Ciebie od razu i dla innych po zatwierdzeniu przez moderatora.'}
            </small>
          </form>
        )}
        {!isLoggedIn && (
          <p style={{ color: '#666', marginBottom: '24px' }}>
            <a href="/login" style={{ color: 'var(--color-primary)' }}>Zaloguj się</a>, aby dodać komentarz.
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {comments.length === 0 && <p style={{ color: '#888' }}>Brak komentarzy.</p>}
          {comments.map((comment) => {
            const isOwnComment = user && comment.author.id === user.id;
            const isPending = comment.status === 'PENDING';
            
            return (
              <div 
                key={comment.id} 
                className="card" 
                style={{ 
                  background: isPending ? '#fff3cd' : '#f9f9f9',
                  borderLeft: isPending ? '4px solid #ffc107' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                      <strong>{comment.author.name || comment.author.email}</strong>
                      {isOwnComment && ' (Ty)'} •{' '}
                      {new Date(comment.createdAt).toLocaleDateString('pl-PL')}
                      {isPending && ' • '}
                      {isPending && <span style={{ color: '#ffc107', fontWeight: 'bold' }}>OCZEKUJE NA ZATWIERDZENIE</span>}
                    </p>
                    <p style={{ margin: '8px 0 0', fontSize: '1em' }}>{comment.content}</p>
                  </div>
                  {(isOwnComment || isAdmin) && (
                    <button 
                      className="button" 
                      onClick={() => deleteComment(comment.id)}
                      style={{ 
                        background: '#dc3545', 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '0.85rem',
                        marginLeft: '1rem'
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
