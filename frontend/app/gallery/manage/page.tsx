'use client';

import { useEffect, useState } from 'react';

type Image = { id: number; title: string; description: string; url: string };

export default function GalleryManagePage() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/gallery/images')
      .then((r) => r.json())
      .then(setImages);
  }, []);

  const addToSlider = async (imageId: number) => {
    await fetch('http://localhost:3001/gallery/slider', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ imageId }),
    });
  };

  return (
    <div>
      <h2>Wybór zdjęć do slidera</h2>
      <div className="grid grid-3">
        {images.map((img) => (
          <div className="card" key={img.id}>
            <img src={img.url} alt={img.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            <strong>{img.title}</strong>
            <p>{img.description}</p>
            <button className="button" onClick={() => addToSlider(img.id)}>Dodaj do slidera</button>
          </div>
        ))}
      </div>
    </div>
  );
}
