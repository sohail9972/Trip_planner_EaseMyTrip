import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ThemeToggle } from '@/components/theme-toggle';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <Outlet />
        </div>
      </main>
      
      <Footer />
      
      {/* Global toast notifications */}
      <Toaster position="top-right" richColors />
      
      {/* Theme toggle floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
