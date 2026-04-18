import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { Sparkles, Compass, Heart, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/discover" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">MatchMaker</span>
          </Link>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border/50 sm:hidden">
        <div className="flex items-center justify-around h-16">
          <Link to="/discover">
            <Button
              variant="ghost"
              size="icon"
              className={isActive('/discover') ? 'text-primary' : ''}
            >
              <Compass className="w-6 h-6" />
            </Button>
          </Link>
          <Link to="/matches">
            <Button
              variant="ghost"
              size="icon"
              className={isActive('/matches') ? 'text-primary' : ''}
            >
              <Heart className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden sm:block fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-xl p-2 space-y-2">
          <Link to="/discover">
            <Button
              variant={isActive('/discover') ? 'default' : 'ghost'}
              size="icon"
            >
              <Compass className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/matches">
            <Button
              variant={isActive('/matches') ? 'default' : 'ghost'}
              size="icon"
            >
              <Heart className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
