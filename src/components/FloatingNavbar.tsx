
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
import { cn } from '@/lib/utils';
import UserRoleBadge from './users/UserRoleBadge';

const FloatingNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto px-2 sm:px-0 max-w-[min(95%,600px)]">
      <div className="glass-morphism rounded-xl py-3 px-4 sm:px-8 flex items-center gap-3 sm:gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 backdrop-blur-xl">
        {/* Logo */}
        <div className="hidden md:block text-xl font-bold text-gradient pr-4 border-r border-white/10">
          Monitor Azure
        </div>
        <div className="md:hidden text-xl font-bold text-gradient">MA</div>
        
        {/* Navigation links - only show if logged in */}
        {user && (
          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? "secondary" : "ghost"} 
                size="sm"
                className={cn(
                  "button-glow flex gap-1 sm:gap-2 items-center rounded-full px-2 sm:px-4",
                  isActive('/dashboard') ? "bg-primary/20" : ""
                )}
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
                  className={cn(
                    "button-glow flex gap-1 sm:gap-2 items-center rounded-full px-2 sm:px-4",
                    isActive('/users') ? "bg-primary/20" : ""
                  )}
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
                className={cn(
                  "button-glow flex gap-1 sm:gap-2 items-center rounded-full px-2 sm:px-4",
                  isActive('/profile') ? "bg-primary/20" : ""
                )}
              >
                <User size={16} />
                <span className="sm:inline hidden">Perfil</span>
              </Button>
            </Link>
          </div>
        )}
        
        {/* Divider */}
        <div className="h-8 w-px bg-white/10"></div>
        
        {/* User menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarImage src={user.avatarUrl} alt={user.username} />
                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-sm font-medium truncate max-w-[100px]">{user.username}</div>
              <div className="hidden sm:block">
                <UserRoleBadge role={user.role} />
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
        
        {/* Decorative elements for futuristic look */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-0 left-0 w-5 h-5 rounded-br-lg border-b border-r border-white/20"></div>
            <div className="absolute top-0 right-0 w-5 h-5 rounded-bl-lg border-b border-l border-white/20"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 rounded-tr-lg border-t border-r border-white/20"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-lg border-t border-l border-white/20"></div>
          </div>
        </div>
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute -z-20 inset-0 blur-2xl bg-primary/5 rounded-full"></div>
    </div>
  );
};

export default FloatingNavbar;
