import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import { TripProvider } from '@/context/trip-context';
import { ProtectedRoute } from '@/components/protected-route';

// Layouts
import { MainLayout } from '@/layouts/main-layout';
import { AuthLayout } from '@/layouts/auth-layout';

// Pages
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { TripPlannerPage } from '@/pages/trips/planner';
import { TripDetailsPage } from '@/pages/trips/[id]';
import { MyTripsPage } from '@/pages/trips/my-trips';
import { DestinationPage } from '@/pages/destinations/[id]';
import { DestinationsPage } from '@/pages/destinations';
import { ProfilePage } from '@/pages/profile';
import { NotFoundPage } from '@/pages/not-found';
import { AboutPage } from '@/pages/about';
import { ContactPage } from '@/pages/contact';
import { BlogPage } from '@/pages/blog';
import { FaqPage } from '@/pages/faq';
import { HelpPage } from '@/pages/help';
// The following are simple placeholders; create pages if needed
const PrivacyPage = () => (
  <div className="container mx-auto py-10">
    <h1 className="text-2xl font-semibold">Privacy Policy</h1>
    <p className="text-muted-foreground mt-2">Our commitment to your privacy.</p>
  </div>
);
const TermsPage = () => (
  <div className="container mx-auto py-10">
    <h1 className="text-2xl font-semibold">Terms of Service</h1>
    <p className="text-muted-foreground mt-2">Please review our terms.</p>
  </div>
);
const SettingsPage = () => (
  <div className="container mx-auto py-10">
    <h1 className="text-2xl font-semibold">Settings</h1>
    <p className="text-muted-foreground mt-2">Manage your application settings.</p>
  </div>
);

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
            <TripProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public Routes */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/destinations" element={<DestinationsPage />} />
                    <Route path="/destinations/:id" element={<DestinationPage />} />
                    
                    {/* Auth Routes */}
                    <Route element={<AuthLayout />}>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                    </Route>
                    
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/plan-trip" element={<TripPlannerPage />} />
                      <Route path="/trips" element={<MyTripsPage />} />
                      <Route path="/trips/:id" element={<TripDetailsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                    
                    {/* 404 - Not Found */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
                
                {/* Toast Notifications */}
                <Toaster position="top-right" richColors />
              </div>
            </TripProvider>
          </AuthProvider>
        </ThemeProvider>
        
        {/* React Query Devtools - Only in development */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </Router>
    </QueryClientProvider>
  )
}

export default App
