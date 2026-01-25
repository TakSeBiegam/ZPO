'use client';

import { useState, useRef } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, isLoading, isLoggedIn } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  const isAuthorized = isLoggedIn && user && (user.role === 'ADMIN' || user.role === 'MODERATOR');

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const finalContent = editorRef.current?.innerHTML || content;
    
    if (!title || !finalContent.trim()) {
      setError('WypeĹ‚nij wszystkie pola');
      return;
    }

    const res = await fetch('http://localhost:3001/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, content: finalContent }),
    });

    if (res.ok) {
      setSuccess(`Post "${title}" zostaĹ‚ utworzony!`);
      setTitle('');
      setContent('');
      if (editorRef.current) editorRef.current.innerHTML = '';
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      setError('BĹ‚Ä…d podczas tworzenia posta');
    }
  };

  if (isLoading) return <div>Ĺadowanie...</div>;

  if (!isAuthorized) {
    return (
      <div>
        <h2>UtwĂłrz post</h2>
        <div className="card">
          <p>Ta sekcja jest dostÄ™pna tylko dla administratorĂłw i moderatorĂłw.</p>
          <a href="/login" className="button" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Zaloguj siÄ™
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>UtwĂłrz nowy post</h2>
      
      {error && (
        <div className="card" style={{ backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="card" style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' }}>
          {success}
          <br />
          <small>Przekierowywanie na stronÄ™ gĹ‚ĂłwnÄ…...</small>
        </div>
      )}

      <div className="card">
        <form onSubmit={createPost}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              TytuĹ‚ posta
            </label>
            <input 
              className="input" 
              placeholder="WprowadĹş tytuĹ‚ posta" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              TreĹ›Ä‡ posta
            </label>
            
            {/* Pasek narzÄ™dzi HTML */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginBottom: '0.5rem', 
              padding: '0.5rem',
              background: '#f5f5f5',
              borderRadius: '4px',
              flexWrap: 'wrap'
            }}>
              <button type="button" onClick={() => applyFormat('bold')} style={{ padding: '0.25rem 0.5rem', background: 'white', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }} title="Pogrubienie">
                <strong>B</strong>
              </button>
              <button type="button" onClick={() => applyFormat('italic')} style={{ padding: '0.25rem 0.5rem', background: 'white', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }} title="Kursywa">
                <em>I</em>
              </button>
              <button type="button" onClick={() => applyFormat('underline')} style={{ padding: '0.25rem 0.5rem', background: 'white', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }} title="PodkreĹ›lenie">
                <u>U</u>
              </button>
              <button type="button" onClick={() => applyFormat('insertUnorderedList')} style={{ padding: '0.25rem 0.5rem', background: 'white', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }} title="Lista punktowana">
                â€˘ Lista
              </button>
              <button type="button" onClick={() => applyFormat('insertOrderedList')} style={{ padding: '0.25rem 0.5rem', background: 'white', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }} title="Lista numerowana">
                1. Lista
              </button>
              <button type="button" onClick={() => applyFormat('formatBlock', 'h3')} style={{ padding: '0.25rem 0.5rem', background: 'white', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }} title="NagĹ‚Ăłwek">
                H3
              </button>
              <button type="button" onClick={() => applyFormat('createLink', prompt('WprowadĹş URL:') || '')} style={{ padding: '0.25rem 0.5rem', background: 'white', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }} title="Link">
                đź”— Link
              </button>
            </div>

            {/* Edytor WYSIWYG */}
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              style={{
                minHeight: '200px',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                outline: 'none',
                lineHeight: '1.6'
              }}
              aria-placeholder="WprowadĹş treĹ›Ä‡ posta (moĹĽesz uĹĽywaÄ‡ formatowania HTML)"
            />
            <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
              UĹĽyj przyciskĂłw powyĹĽej aby sformatowaÄ‡ tekst
            </small>
          </div>

          <button className="button" type="submit">
            Opublikuj post
          </button>
          
          {user?.role === 'ADMIN' && (
            <small style={{ display: 'block', marginTop: '1rem', color: '#666' }}>
              â„ąď¸Ź Jako admin, TwĂłj post zostanie automatycznie zatwierdzony.
            </small>
          )}
          {user?.role === 'MODERATOR' && (
            <small style={{ display: 'block', marginTop: '1rem', color: '#666' }}>
              â„ąď¸Ź Jako moderator, TwĂłj post bÄ™dzie wymagaĹ‚ zatwierdzenia przez administratora.
            </small>
          )}
        </form>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button 
          className="button" 
          onClick={() => router.push('/')}
          style={{ background: '#6c757d' }}
        >
          â† PowrĂłt do strony gĹ‚Ăłwnej
        </button>
      </div>
    </div>
  );
}

# Modified on 2026-01-25 17:10:00
# Modified on 2026-01-25 17:10:00
# Modified on 2026-01-25 17:10:00
