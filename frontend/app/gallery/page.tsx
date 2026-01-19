'use client';

import { useEffect, useState } from 'react';

type SliderItem = { id: number; image: { url: string; title: string; description: string } };

export default function GallerySliderPage() {
  const [items, setItems] = useState<SliderItem[]>([]);
  const [start, setStart] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3001/gallery/slider')
      .then((r) => r.json())
      .then(setItems);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setStart((s) => (items.length ? (s + 1) % items.length : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, [items.length]);

  const visibleCount = 3;
  const visible = items.length
    ? Array.from({ length: Math.min(visibleCount, items.length) }).map((_, i) => items[(start + i) % items.length])
    : [];

  return (
    <div>
      <h2>Galeria</h2>
      <div className="grid grid-3 slider">
        {visible.map((item) => (
          <div className="card slider-item fade-in" key={item.id}>
            <img src={item.image.url} alt={item.image.title} />
            <strong>{item.image.title}</strong>
            <p>{item.image.description}</p>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="card">
          <p>Galeria jest pusta. Administrator może dodać zdjęcia w sekcji zarządzania.</p>
        </div>
      )}
    </div>
  );
}
