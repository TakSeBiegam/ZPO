'use client';

import { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';

type Order = { id: number; status: string; items: { id: number; quantity: number; price: number }[] };

export default function OrdersPage() {
  const { isLoggedIn, isLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:3001/cart/orders', { credentials: 'include' })
        .then((r) => r.json())
        .then((data) => setOrders(Array.isArray(data) ? data : []));
    }
  }, [isLoggedIn]);

  if (isLoading) return <div>Ładowanie...</div>;

  if (!isLoggedIn) {
    return (
      <div>
        <h2>Zamówienia</h2>
        <div className="card">
          <p>Musisz być zalogowany, aby zobaczyć listę zamówionych rzeczy.</p>
          <a href="/login" className="button" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Zaloguj się
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Zamówienia</h2>
      <div className="grid grid-2">
        {orders.map((order) => (
          <div className="card" key={order.id}>
            <strong>Zamówienie #{order.id}</strong>
            <p>Status: {order.status}</p>
            <p>Pozycje: {order.items.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
