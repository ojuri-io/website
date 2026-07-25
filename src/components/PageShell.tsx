import type { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <>
      <header>
        <TopNav />
      </header>
      <main id="main" className="font-sans">
        {children}
      </main>
      <Footer />
    </>
  );
}
