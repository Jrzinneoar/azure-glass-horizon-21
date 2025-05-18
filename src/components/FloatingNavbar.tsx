
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LogOut,
  User,
  Users,
  Monitor,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const FloatingNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(false);
  
  // Auto-collapse navbar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-2 sm:px-0 w-[95%] sm:max-w-2xl mx-auto"
    >
      <motion.div 
        className={cn(
          "glass-morphism rounded-2xl py-3 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/20 backdrop-blur-xl transition-all duration-300",
          hovered ? "shadow-[0_8px_40px_rgba(149,128,255,0.5)] border-white/40" : "",
          expanded ? "w-full" : "w-auto"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        layout
      >
        {/* Toggle button (visible on mobile) */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full md:hidden flex-shrink-0 bg-white/5" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <X size={18} /> : <Menu size={18} />}
        </Button>
        
        {/* Logo */}
        <motion.div 
          className={cn(
            "md:flex text-xl font-bold text-gradient pr-4 border-r border-white/10 transition-all",
            expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden pr-0 border-none"
          )}
          animate={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
        >
          Monitor Azure
        </motion.div>
        
        {/* Navigation links - only show if logged in */}
        {user && (
          <div className={cn(
            "flex items-center justify-center gap-1 sm:gap-2 transition-all overflow-hidden flex-grow",
            expanded ? "w-auto opacity-100" : "w-0 opacity-0 md:w-auto md:opacity-100"
          )}>
            <Link to="/dashboard">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant={isActive('/dashboard') ? "secondary" : "ghost"} 
                  size="sm"
                  className={cn(
                    "button-glow flex gap-1 sm:gap-2 items-center rounded-full px-2 sm:px-4",
                    isActive('/dashboard') ? "bg-primary/20" : ""
                  )}
                >
                  <Monitor size={16} />
                  {expanded && <span>VMs</span>}
                </Button>
              </motion.div>
            </Link>
            
            {/* Admins and founders can see users */}
            {(user.role === 'admin' || user.role === 'founder') && (
              <Link to="/users">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant={isActive('/users') ? "secondary" : "ghost"} 
                    size="sm" 
                    className={cn(
                      "button-glow flex gap-1 sm:gap-2 items-center rounded-full px-2 sm:px-4",
                      isActive('/users') ? "bg-primary/20" : ""
                    )}
                  >
                    <Users size={16} />
                    {expanded && <span>Usuários</span>}
                  </Button>
                </motion.div>
              </Link>
            )}
            
            {/* Profile page for all users */}
            <Link to="/profile">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant={isActive('/profile') ? "secondary" : "ghost"} 
                  size="sm" 
                  className={cn(
                    "button-glow flex gap-1 sm:gap-2 items-center rounded-full px-2 sm:px-4",
                    isActive('/profile') ? "bg-primary/20" : ""
                  )}
                >
                  <User size={16} />
                  {expanded && <span>Perfil</span>}
                </Button>
              </motion.div>
            </Link>
          </div>
        )}
        
        {/* User menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <div className="relative">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Avatar className="h-8 w-8 border border-white/20 ring-2 ring-white/10">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full ring-2 ring-black"></div>
              </div>
              {expanded && (
                <div className="hidden sm:block text-sm font-medium truncate max-w-[100px]">{user.username}</div>
              )}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="button-glow text-destructive rounded-full" 
                  onClick={logout}
                >
                  <LogOut size={16} />
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="default" 
                size="sm" 
                className="button-glow rounded-full bg-[#5865F2] hover:bg-[#4752c4]" 
                onClick={() => window.location.href = '/'}
              >
                <svg width="18" height="18" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <g clipPath="url(#clip0)">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#ffffff"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="71" height="55" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Login
              </Button>
            </motion.div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1 left-1 w-5 h-5 rounded-br-lg border-b border-r border-white/20"></div>
            <div className="absolute top-1 right-1 w-5 h-5 rounded-bl-lg border-b border-l border-white/20"></div>
            <div className="absolute bottom-1 left-1 w-5 h-5 rounded-tr-lg border-t border-r border-white/20"></div>
            <div className="absolute bottom-1 right-1 w-5 h-5 rounded-tl-lg border-t border-l border-white/20"></div>
          </div>
        </div>
      </motion.div>
      
      {/* Subtle glow effect */}
      <div className="absolute -z-20 inset-0 blur-3xl bg-primary/5 rounded-full"></div>
    </motion.div>
  );
};

export default FloatingNavbar;
