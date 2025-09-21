import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const demoMode = (import.meta as any).env?.VITE_DEMO_MODE === 'true' || (import.meta as any).env?.DEV;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Allow planner access in demo mode without auth
  if (demoMode && location.pathname === '/plan-trip') {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    // Redirect to login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
