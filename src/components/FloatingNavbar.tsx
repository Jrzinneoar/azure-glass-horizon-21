
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LogOut,
  User,
  Users,
  Monitor
} from 'lucide-react';

const FloatingNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Determine if we're on a dashboard page to adjust navbar position
  const isDashboardPage = location.pathname === '/dashboard' || 
                          location.pathname === '/users' || 
                          location.pathname === '/profile';
  
  const navbarPosition = isDashboardPage ? 'navbar-float-bottom' : 'navbar-float';
  
  return (
    <div className={`${navbarPosition} flex flex-col items-center justify-center`}>
      {/* Logo */}
      <div className="flex items-center justify-center w-full mb-2">
        <div className="text-xl font-bold text-gradient text-center">Monitor Azure</div>
      </div>
      
      {/* Navigation links - only show if logged in */}
      {user && (
        <div className="flex items-center justify-center gap-2">
          <Link to="/dashboard">
            <Button 
              variant={isActive('/dashboard') ? "secondary" : "ghost"} 
              size="sm"
              className="button-glow flex gap-2 items-center rounded-full"
            >
              <Monitor size={16} />
              <span className="sm:inline hidden">VMs</span>
            </Button>
          </Link>
          
          {/* Admins and founders can see users */}
          {(user.role === 'admin' || user.role === 'founder') && (
            <Link to="/users">
              <Button 
                variant={isActive('/users') ? "secondary" : "ghost"} 
                size="sm" 
                className="button-glow flex gap-2 items-center rounded-full"
              >
                <Users size={16} />
                <span className="sm:inline hidden">Usuários</span>
              </Button>
            </Link>
          )}
          
          {/* Profile page for all users */}
          <Link to="/profile">
            <Button 
              variant={isActive('/profile') ? "secondary" : "ghost"} 
              size="sm" 
              className="button-glow flex gap-2 items-center rounded-full"
            >
              <User size={16} />
              <span className="sm:inline hidden">Perfil</span>
            </Button>
          </Link>
        </div>
      )}
      
      {/* User menu - centered */}
      <div className="flex items-center justify-center w-full mt-2 gap-2">
        {user ? (
          <>
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-sm font-medium truncate max-w-[100px] text-center">{user.username}</div>
            <div className="hidden md:block text-xs bg-secondary px-2 py-0.5 rounded-full text-center">
              {user.role === 'founder' ? 'Fundador' : user.role === 'admin' ? 'Admin' : 'Cliente'}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="button-glow text-destructive rounded-full" 
              onClick={logout}
            >
              <LogOut size={16} />
            </Button>
          </>
        ) : (
          <Button variant="default" size="sm" className="button-glow rounded-full" onClick={() => window.location.href = '/'}>
            Entrar com Discord
          </Button>
        )}
      </div>
    </div>
  );
};

export default FloatingNavbar;
