
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

export type UserRole = 'founder' | 'admin' | 'client';

export interface VMAccessPeriod {
  vmId: string;
  userId: string;
  expiresAt: string; // ISO date string
}

export interface User {
  id: string;
  username: string;
  discriminator?: string;
  avatar: string;
  email?: string;
  role: UserRole;
  avatarUrl: string;
  vmAccess?: VMAccessPeriod[];
}

export interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  ip: string;
  type: string;
  location: string;
  ownerId?: string; // ID of the assigned client, if any
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  users: User[];
  virtualMachines: VirtualMachine[];
  getUserVMs: (userId: string) => VirtualMachine[];
  assignVMToUser: (vmId: string, userId: string, durationDays: number) => void;
  removeVMFromUser: (vmId: string, userId: string) => void;
  updateVMAccessPeriod: (vmId: string, userId: string, durationDays: number) => void;
  loginWithDiscordCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUserRole: () => {},
  users: [],
  virtualMachines: [],
  getUserVMs: () => [],
  assignVMToUser: () => {},
  removeVMFromUser: () => {},
  updateVMAccessPeriod: () => {},
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
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
    vmAccess: []
  },
  {
    id: '2345678901234567',
    username: 'admin_user',
    avatar: '5678',
    role: 'admin',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/1.png',
    vmAccess: []
  },
  {
    id: '3456789012345678',
    username: 'client_user',
    avatar: '9012',
    role: 'client',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/2.png',
    vmAccess: []
  }
];

// Mock VMs data
const mockVMs: VirtualMachine[] = [
  {
    id: 'vm-1',
    name: 'Production-Server',
    status: 'running',
    ip: '192.168.1.10',
    type: 'Standard_D2s_v3',
    location: 'East US'
  },
  {
    id: 'vm-2',
    name: 'Dev-Environment',
    status: 'stopped',
    ip: '192.168.1.11',
    type: 'Standard_B2s',
    location: 'West Europe'
  },
  {
    id: 'vm-3',
    name: 'Database-Server',
    status: 'running',
    ip: '192.168.1.12',
    type: 'Standard_E4_v3',
    location: 'Southeast Asia'
  },
  {
    id: 'vm-4',
    name: 'Test-Server',
    status: 'error',
    ip: '192.168.1.13',
    type: 'Standard_B1s',
    location: 'Central US'
  },
  {
    id: 'vm-5',
    name: 'Backup-Server',
    status: 'stopped',
    ip: '192.168.1.14',
    type: 'Standard_D4s_v3',
    location: 'North Europe'
  },
  {
    id: 'vm-6',
    name: 'Analytics-VM',
    status: 'running',
    ip: '192.168.1.15',
    type: 'Standard_F8s_v2',
    location: 'East Asia'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>(mockVMs);

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

  // Clean up expired VM access periods
  useEffect(() => {
    const cleanupExpiredVMAccess = () => {
      const now = new Date().toISOString();
      
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (!user.vmAccess) return user;
          
          const updatedVMAccess = user.vmAccess.filter(
            access => access.expiresAt > now
          );
          
          return {
            ...user,
            vmAccess: updatedVMAccess
          };
        })
      );
    };
    
    // Run cleanup on load and every hour
    cleanupExpiredVMAccess();
    const interval = setInterval(cleanupExpiredVMAccess, 1000 * 60 * 60);
    
    return () => clearInterval(interval);
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
      
      // Create avatarUrl
      const avatarUrl = discordUser.avatar 
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` 
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || '0', 10) % 5}.png`;
      
      // See if this user already exists in our users list
      const existingUser = users.find(u => u.id === discordUser.id);
      if (existingUser) {
        return existingUser; // Use existing role if the user exists
      }
      
      // Create new user object
      const newUser: User = {
        id: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar,
        email: discordUser.email,
        role: role,
        avatarUrl: avatarUrl,
        vmAccess: []
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

  // VM access control functions
  const getUserVMs = (userId: string): VirtualMachine[] => {
    // Find the user
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser || !targetUser.vmAccess || targetUser.vmAccess.length === 0) {
      return [];
    }

    // Get current time
    const now = new Date().toISOString();

    // Filter VMs that the user has access to and haven't expired
    const accessibleVMIds = targetUser.vmAccess
      .filter(access => access.expiresAt > now)
      .map(access => access.vmId);

    return virtualMachines.filter(vm => accessibleVMIds.includes(vm.id));
  };

  const assignVMToUser = (vmId: string, userId: string, durationDays: number) => {
    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // Update the user's VM access
    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === userId) {
          const newAccess: VMAccessPeriod = {
            vmId,
            userId,
            expiresAt: expiresAt.toISOString()
          };
          
          const vmAccess = u.vmAccess || [];
          const filteredAccess = vmAccess.filter(access => access.vmId !== vmId);
          
          return {
            ...u,
            vmAccess: [...filteredAccess, newAccess]
          };
        }
        return u;
      })
    );

    toast.success(`VM access granted to user for ${durationDays} days`);
  };

  const removeVMFromUser = (vmId: string, userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === userId && u.vmAccess) {
          return {
            ...u,
            vmAccess: u.vmAccess.filter(access => access.vmId !== vmId)
          };
        }
        return u;
      })
    );

    toast.info(`VM access removed from user`);
  };

  const updateVMAccessPeriod = (vmId: string, userId: string, durationDays: number) => {
    // Calculate new expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    setUsers(prevUsers =>
      prevUsers.map(u => {
        if (u.id === userId && u.vmAccess) {
          return {
            ...u,
            vmAccess: u.vmAccess.map(access => 
              access.vmId === vmId
                ? { ...access, expiresAt: expiresAt.toISOString() }
                : access
            )
          };
        }
        return u;
      })
    );

    toast.success(`VM access period updated to ${durationDays} days`);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUserRole, 
      users,
      virtualMachines,
      getUserVMs,
      assignVMToUser,
      removeVMFromUser,
      updateVMAccessPeriod,
      loginWithDiscordCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};
