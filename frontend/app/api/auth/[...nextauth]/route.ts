import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Register user in backend when signing in with OAuth
      if (!user.email) return false;
      
      try {
        const response = await fetch('http://localhost:3001/auth/oauth-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: account?.provider,
            providerId: account?.providerAccountId,
          }),
        });
        
        if (!response.ok) {
          console.error('OAuth registration failed:', await response.text());
          return false;
        }
        
        const backendUser = await response.json();
        console.log('User registered in backend:', backendUser);
        
        return true;
      } catch (error) {
        console.error('OAuth registration error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      // Dodaj informacje z tokena do sesji
      if (token && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;
# Modified on 2026-01-23 13:50:00
