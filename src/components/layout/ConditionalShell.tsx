'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface Props {
  children: React.ReactNode;
}

// Routes where Navbar and Footer should be hidden (full-screen app shells)
const FULLSCREEN_ROUTES = ['/admin', '/hesabim/panel'];

export default function ConditionalShell({ children }: Props) {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_ROUTES.some(route => pathname.startsWith(route));

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
        <Footer />
      </div>
    </>
  );
}
