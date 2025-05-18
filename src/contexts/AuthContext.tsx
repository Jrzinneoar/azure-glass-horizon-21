
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export type UserRole = 'founder' | 'admin' | 'client';

export interface User {
  id: string;
  username: string;
  discriminator?: string;
  avatar: string;
  email?: string;
  role: UserRole;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUserRole: () => {},
  users: []
});

export const useAuth = () => useContext(AuthContext);

const CLIENT_ID = '1360988492494274570';
const REDIRECT_URI = encodeURIComponent(window.location.origin + '/auth/callback');

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1345386650502565998',
    username: 'founder_user',
    avatar: '1234',
    role: 'founder',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png'
  },
  {
    id: '2345678901234567',
    username: 'admin_user',
    avatar: '5678',
    role: 'admin',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png'
  },
  {
    id: '3456789012345678',
    username: 'client_user',
    avatar: '9012',
    role: 'client',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/2.png'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check if we have a token in localStorage
    const checkAuth = async () => {
      const token = localStorage.getItem('discord_token');
      if (token) {
        try {
          // In a real app, we would validate the token with Discord
          // For now, we'll simulate authentication with mock data
          const foundUser = await simulateAuthCheck(token);
          if (foundUser) {
            setUser(foundUser);
            toast.success(`Welcome back, ${foundUser.username}!`);
          } else {
            localStorage.removeItem('discord_token');
          }
        } catch (error) {
          console.error('Auth check failed', error);
          localStorage.removeItem('discord_token');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Simulate authentication check - in a real app this would call Discord's API
  const simulateAuthCheck = async (token: string): Promise<User | null> => {
    // This simulates checking if the token corresponds to a user
    // In a real app, we'd make an API call to Discord
    
    // For demo purposes, let's pretend the token contains the user ID
    const userIdFromToken = token.split('_')[0];
    const foundUser = users.find(u => u.id === userIdFromToken);
    return foundUser || null;
  };

  const login = () => {
    // Redirect to Discord OAuth2 authorization URL
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify%20email`;
    window.location.href = url;
  };

  const logout = () => {
    localStorage.removeItem('discord_token');
    setUser(null);
    toast.info('You have been logged out');
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, role } : u
      )
    );
    
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, role } : null);
    }
    
    toast.success(`User role updated to ${role}`);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserRole, users }}>
      {children}
    </AuthContext.Provider>
  );
};
