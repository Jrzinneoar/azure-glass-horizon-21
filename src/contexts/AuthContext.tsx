
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
  loginWithDiscordCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUserRole: () => {},
  users: [],
  loginWithDiscordCode: async () => {}
});

export const useAuth = () => useContext(AuthContext);

const CLIENT_ID = '1360988492494274570';
const CLIENT_SECRET = 'oVbOBZdPlDcg6KKcFcP5W-18sD_hgb09';
const REDIRECT_URI = encodeURIComponent(window.location.origin + '/auth/callback');

// Mock users for demonstration and fallback
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
          // Try to get user info using the token
          const userData = await fetchUserFromDiscord(token);
          if (userData) {
            setUser(userData);
            toast.success(`Welcome back, ${userData.username}!`);
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

  const fetchUserFromDiscord = async (token: string): Promise<User | null> => {
    try {
      // In a real scenario, we'd use the token to get user data from Discord
      // For this implementation, let's parse the access token we stored
      if (token.includes('mock')) {
        // Handle mock tokens
        const userIdFromToken = token.split('_')[0];
        const foundUser = users.find(u => u.id === userIdFromToken);
        return foundUser || null;
      }

      // Attempt to fetch real user data from Discord API
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const discordUser = await response.json();
      
      // Determine role based on user ID
      let role: UserRole = 'client'; // Default role
      if (discordUser.id === '1345386650502565998') {
        role = 'founder';
      }
      
      // See if this user already exists in our users list
      const existingUser = users.find(u => u.id === discordUser.id);
      if (existingUser) {
        return existingUser; // Use existing role if the user exists
      }
      
      // Create avatarUrl
      const avatarUrl = discordUser.avatar 
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` 
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || '0', 10) % 5}.png`;
      
      // Create new user object
      const newUser: User = {
        id: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
        email: discordUser.email,
        role: role,
        avatarUrl: avatarUrl
      };
      
      // Add new user to users list
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      return newUser;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const loginWithDiscordCode = async (code: string): Promise<void> => {
    try {
      // Exchange the code for a token with Discord
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: decodeURIComponent(REDIRECT_URI)
        })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(`Failed to get token: ${errorData.error_description || 'Unknown error'}`);
      }

      const tokenData = await tokenResponse.json();
      const { access_token } = tokenData;
      
      // Store the token
      localStorage.setItem('discord_token', access_token);
      
      // Fetch the user data with the token
      const userData = await fetchUserFromDiscord(access_token);
      
      if (!userData) {
        throw new Error('Failed to fetch user data');
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUserRole, 
      users,
      loginWithDiscordCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};
