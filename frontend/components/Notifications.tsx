'use client';

import { useEffect, useState } from 'react';

type Notification = { id: number; message: string; createdAt: string };
type PaginationData = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function Notifications() {
  const [items, setItems] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadNotifications = (page: number) => {
    fetch(`http://localhost:3001/notifications?page=${page}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { items: [], pagination: null }))
      .then((data) => {
        setItems(data.items || []);
        setPagination(data.pagination || null);
        setCurrentPage(page);
      });
  };

  useEffect(() => {
    loadNotifications(1);
  }, []);

  if (!items.length) return <p>Brak nowych powiadomień.</p>;

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((n) => (
          <li key={n.id} style={{ 
            padding: '0.5rem', 
            borderBottom: '1px solid #eee',
            fontSize: '0.9rem'
          }}>
            {n.message}
            <br />
            <small style={{ color: '#999' }}>
              {new Date(n.createdAt).toLocaleDateString('pl-PL', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </small>
          </li>
        ))}
      </ul>
      
      {pagination && pagination.totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem', 
          marginTop: '1rem',
          alignItems: 'center'
        }}>
          <button 
            onClick={() => loadNotifications(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              background: currentPage === 1 ? '#ccc' : 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Poprzednia
          </button>
          
          <span style={{ color: '#666' }}>
            Strona {currentPage} z {pagination.totalPages}
          </span>
          
          <button 
            onClick={() => loadNotifications(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            style={{
              padding: '0.5rem 1rem',
              background: currentPage === pagination.totalPages ? '#ccc' : 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Następna →
          </button>
        </div>
      )}
    </div>
  );
}
