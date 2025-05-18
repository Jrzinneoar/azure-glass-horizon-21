
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LogOut,
  Settings,
  Users,
  Monitor
} from 'lucide-react';

const FloatingNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="navbar-float flex items-center gap-4">
      {/* Logo */}
      <div className="text-xl font-bold text-gradient">Azure Monitor</div>
      
      {/* Navigation links - only show if logged in */}
      {user && (
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button 
              variant={isActive('/dashboard') ? "secondary" : "ghost"} 
              size="sm"
              className="button-glow flex gap-2 items-center"
            >
              <Monitor size={16} />
              <span>VMs</span>
            </Button>
          </Link>
          
          {/* Admin users and founders can see users */}
          {(user.role === 'admin' || user.role === 'founder') && (
            <Link to="/users">
              <Button 
                variant={isActive('/users') ? "secondary" : "ghost"} 
                size="sm" 
                className="button-glow flex gap-2 items-center"
              >
                <Users size={16} />
                <span>Users</span>
              </Button>
            </Link>
          )}
          
          {/* Only founders can see settings */}
          {user.role === 'founder' && (
            <Link to="/settings">
              <Button 
                variant={isActive('/settings') ? "secondary" : "ghost"} 
                size="sm" 
                className="button-glow flex gap-2 items-center"
              >
                <Settings size={16} />
                <span>Settings</span>
              </Button>
            </Link>
          )}
        </div>
      )}
      
      {/* User menu */}
      <div className="flex items-center ml-auto gap-2">
        {user ? (
          <>
            <Avatar className="h-8 w-8 border border-white/20">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-sm font-medium">{user.username}</div>
            <div className="hidden md:block text-xs bg-secondary px-2 py-0.5 rounded-full">
              {user.role}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="button-glow text-destructive" 
              onClick={logout}
            >
              <LogOut size={16} />
            </Button>
          </>
        ) : (
          <Button variant="default" size="sm" className="button-glow">
            Login with Discord
          </Button>
        )}
      </div>
    </div>
  );
};

export default FloatingNavbar;
