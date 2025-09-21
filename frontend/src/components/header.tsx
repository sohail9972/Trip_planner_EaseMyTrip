import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { Menu, User, LogOut, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="md" />
            <span className="hidden font-bold sm:inline-block">AI Trip Planner</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link
            to="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            to="/destinations"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Destinations
          </Link>
          <Link
            to="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Contact
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <Link to="/plan-trip">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Plan a Trip
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/trips">My Trips</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/destinations">Destinations</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact">Contact</Link>
              </DropdownMenuItem>
              {isAuthenticated && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/plan-trip">Plan a Trip</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/trips">My Trips</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
