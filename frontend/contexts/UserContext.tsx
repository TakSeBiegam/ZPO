'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
  id: number;
  email: string;
  role: string;
  name?: string;
} | null;

type UserContextType = {
  user: User;
  isLoading: boolean;
  refetch: () => Promise<void>;
  isLoggedIn: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  refetch: async () => {},
  isLoggedIn: false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/me', { 
        credentials: 'include',
        cache: 'no-store' 
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isLoading, 
        refetch: fetchUser,
        isLoggedIn: user !== null 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
