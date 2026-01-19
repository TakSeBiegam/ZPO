'use client';

import { useEffect, useState } from 'react';

type CartItem = { id: number; quantity: number; product: { title: string; price: number } };

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/cart', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []));
  }, []);

  const placeOrder = async () => {
    await fetch('http://localhost:3001/cart/orders', { method: 'POST', credentials: 'include' });
  };

  return (
    <div>
      <h2>Koszyk</h2>
      <div className='card'>
        <div className="grid grid-2">
          {items.map((item) => (
            <div className="card" key={item.id}>
              <strong>{item.product.title}</strong>
              <p>Ilość: {item.quantity}</p>
              <p>Cena: {item.product.price}</p>
            </div>
          ))}
        </div>
        <button className="button" onClick={placeOrder}>Złóż zamówienie</button>
      </div>
    </div>
  );
}
