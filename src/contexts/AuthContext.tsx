
import React, { createContext, useContext } from 'react';
import { useAuthState } from './hooks/useAuthState';
import { useAuthActions } from './hooks/useAuthActions';
import { User, UserRole, VirtualMachine, VMAccess } from './types/auth.types';

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
  
  // Implement loginWithDiscordCode function with random role selection
  const loginWithDiscordCode = async (code: string) => {
    try {
      setIsLoading(true);
      console.log("Authenticating with Discord code:", code);
      
      // In a real app, you would call your backend API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Modified to not automatically select founder role
      // Use code hash to determine user and role
      const codeHash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Find available users with different roles (excluding the first user who is founder)
      const availableUsers = users.filter((_, index) => index > 0);
      
      if (availableUsers.length > 0) {
        // Select a random non-founder user
        const userIndex = codeHash % availableUsers.length;
        const selectedUser = availableUsers[userIndex];
        
        setUser({
          ...selectedUser,
          avatarUrl: selectedUser.avatarUrl || "https://github.com/shadcn.png"
        });
        console.log(`Logged in as ${selectedUser.username} (${selectedUser.role})`);
      } else {
        // Fallback to a client role if no other users available
        // Create a temporary client user
        const tempUser: User = {
          id: `user-${Date.now()}`,
          username: `client-${Date.now().toString().slice(-4)}`,
          role: 'client',
          email: `client${Date.now().toString().slice(-4)}@example.com`,
          discordId: `discord-${Date.now()}`,
          createdAt: new Date(),
          avatarUrl: "https://github.com/shadcn.png",
        };
        
        setUser(tempUser);
        console.log(`Created temporary client user: ${tempUser.username}`);
      }
    } catch (error) {
      console.error("Error logging in with Discord:", error);
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
