'use client';

import { useEffect, useState } from 'react';

type Product = { id: number; title: string; author: string; description: string; year: number; price: number; imageUrl?: string };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        p.author.toLowerCase().includes(searchAuthor.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTitle, searchAuthor, products]);

  const addToCart = async (productId: number) => {
    await fetch('http://localhost:3001/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId, quantity: 1 }),
    });
  };

  return (
    <div>
      <h2>Księgozbiór</h2>
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3>Wyszukiwanie</h3>
        <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label>Tytuł</label>
            <input
              className="input"
              placeholder="Wpisz tytuł..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Autor</label>
            <input
              className="input"
              placeholder="Wpisz autora..."
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
            />
          </div>
        </div>
        <p style={{ marginTop: '8px' }}>Znaleziono: {filteredProducts.length} książek</p>
      </div>
      <div className="grid grid-3">
        {filteredProducts.map((p) => (
          <div className="card" key={p.id}>
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
              />
            )}
            <strong style={{ fontSize: '1.1em' }}>{p.title}</strong>
            <p style={{ fontSize: '0.9em', color: '#666' }}>Autor: {p.author}</p>
            <p style={{ fontSize: '0.85em', color: '#888' }}>Rok wydania: {p.year}</p>
            <p style={{ fontSize: '0.9em', marginTop: '8px' }}>{p.description}</p>
            <p style={{ fontWeight: 'bold', marginTop: '8px' }}>Cena: {(p.price / 100).toFixed(2)} zł</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="button" onClick={() => addToCart(p.id)}>Dodaj do koszyka</button>
              <a href={`/products/${p.id}`} className="button" style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>Szczegóły</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
