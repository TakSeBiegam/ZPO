'use client';

import { useState } from 'react';

export default function GalleryUploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3001/gallery/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, url }),
    });
  };

  return (
    <div className="card">
      <h2>Dodaj zdjęcie</h2>
      <form onSubmit={onSubmit}>
        <input className="input" placeholder="Tytuł" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="input" placeholder="Opis" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className="input" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button className="button" type="submit">Dodaj</button>
      </form>
    </div>
  );
}
