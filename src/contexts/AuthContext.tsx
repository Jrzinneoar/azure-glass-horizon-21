
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
    updateUserRole,
    getUserVMs,
    assignVMToUser,
    removeVMFromUser,
    updateVMAccessPeriod,
    getOwnerName,
    logout
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
  const login = async () => {
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
      // In a real implementation, we would exchange the code for a token and then fetch user data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for the special founder user ID
      const discordId = "1345386650502565998"; // Hard-coding for demonstration
      
      // Simulate fetching user data from Discord
      const founderUser: User = {
        id: discordId,
        username: "Founder User",
        role: 'founder',
        email: "founder@example.com",
        discordId: discordId,
        // Using a random avatar to simulate getting the real Discord avatar
        avatarUrl: `https://i.pravatar.cc/150?u=${discordId}`, 
        createdAt: new Date(),
      };
      
      setUser(founderUser);
      toast.success(`Logged in as Founder`);
      
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
