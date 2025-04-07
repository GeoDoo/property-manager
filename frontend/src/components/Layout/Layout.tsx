import { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <Navigation />
        {children}
      </div>
    </div>
  );
} 