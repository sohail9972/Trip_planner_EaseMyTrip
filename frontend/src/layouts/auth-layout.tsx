import { Outlet, Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Form */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <span className="mr-2 inline-flex"><Logo size="md" /></span>
            AI Trip Planner
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "The journey of a thousand miles begins with a single step."
              </p>
              <footer className="text-sm">Lao Tzu</footer>
            </blockquote>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex h-full items-center justify-center p-8 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome to AI Trip Planner
              </h1>
              <p className="text-sm text-muted-foreground">
                Plan your perfect trip with AI assistance
              </p>
            </div>
            
            {/* Auth form */}
            <div className="grid gap-6">
              <Outlet />
            </div>
            
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
            
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
