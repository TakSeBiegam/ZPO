import './globals.css';
import Header from '../components/Header';
import ThemeScript from '../components/ThemeScript';
import ThemeProvider from '../components/ThemeProvider';
import AuthProvider from '../components/AuthProvider';

export const metadata = {
  title: 'Księgarnia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <ThemeScript />
        <AuthProvider>
          <ThemeProvider />
          <Header />
          <main className="container">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
