
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
  // Adding this for AuthCallback.tsx
  loginWithDiscordCode?: (code: string) => Promise<void>;
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
  
  // Mock function for loginWithDiscordCode
  const loginWithDiscordCode = async (code: string) => {
    try {
      setIsLoading(true);
      console.log("Authenticating with Discord code:", code);
      
      // In a real app, you would call your backend API here
      // For now, simulate a successful login with the founder user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the founder user for mock login
      const founderUser = users.find(u => u.role === 'founder');
      if (founderUser) {
        setUser({
          ...founderUser,
          avatarUrl: founderUser.avatarUrl || "https://github.com/shadcn.png"
        });
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
