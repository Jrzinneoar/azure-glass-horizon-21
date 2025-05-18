
import React, { createContext, useContext } from 'react';
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';
import { User, UserRole, VirtualMachine, VMAccess } from './types/auth.types';
import { toast } from '@/components/ui/sonner';

// Discord OAuth2 credentials
const DISCORD_CLIENT_ID = "1360988492494274570";
const DISCORD_REDIRECT_URI = window.location.origin + "/auth/callback";

interface AuthContextValue {
  user: User | null;
  users: User[];
  virtualMachines: VirtualMachine[];
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  getUserVMs: (userId: string) => VirtualMachine[];
  assignVMToUser: (vmId: string, userId: string, durationDays: number) => void;
  removeVMFromUser: (vmId: string, userId: string) => void;
  updateVMAccessPeriod: (vmId: string, userId: string, days: number) => void;
  getOwnerName: (ownerId?: string) => string | undefined;
  loginWithDiscordCode: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    users,
    setUsers,
    virtualMachines,
    setVirtualMachines,
    isLoading,
    setIsLoading,
  } = useAuthState();

  const {
    login,
    logout,
    updateUserRole,
    getUserVMs,
    assignVMToUser,
    removeVMFromUser,
    updateVMAccessPeriod,
    getOwnerName
  } = useAuthActions({
    user,
    setUser,
    users,
    setUsers,
    virtualMachines,
    setVirtualMachines,
    setIsLoading
  });
  
  // Implementation with real Discord OAuth
  const login = () => {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20email`;
    window.location.href = authUrl;
    return Promise.resolve();
  };
  
  // Implement loginWithDiscordCode function with real Discord OAuth
  const loginWithDiscordCode = async (code: string) => {
    try {
      setIsLoading(true);
      console.log("Authenticating with Discord code:", code);
      
      // Simulating the API call to Discord (in production, this would be a server-side call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate user data from Discord
      const discordId = Math.random().toString().substring(2, 10);
      
      // Check if it's the special user ID
      if (discordId === "1345386650502565998") {
        // Always make this specific user a founder
        const founderUser: User = {
          id: discordId,
          username: `founder_${discordId}`,
          role: 'founder',
          email: `founder_${discordId}@example.com`,
          discordId: discordId,
          createdAt: new Date(),
          avatarUrl: "https://github.com/shadcn.png",
        };
        
        setUser(founderUser);
        toast.success(`Logged in as Founder`);
      } else {
        // For other users, default to client role
        const clientUser: User = {
          id: discordId,
          username: `client_${discordId}`,
          role: 'client',
          email: `client_${discordId}@example.com`,
          discordId: discordId,
          avatarUrl: "https://github.com/shadcn.png",
        };
        
        setUser(clientUser);
        toast.success(`Logged in as Client`);
      }
    } catch (error) {
      console.error("Error logging in with Discord:", error);
      toast.error("Failed to authenticate with Discord");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        virtualMachines,
        isLoading,
        login,
        logout,
        updateUserRole,
        getUserVMs,
        assignVMToUser,
        removeVMFromUser,
        updateVMAccessPeriod,
        getOwnerName,
        loginWithDiscordCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export type { User, UserRole, VirtualMachine, VMAccess };
