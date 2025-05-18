
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
    updateVMAccessPeriod
  } = useAuthActions({
    user,
    setUser,
    users,
    setUsers,
    virtualMachines,
    setVirtualMachines,
    setIsLoading
  });

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
        updateVMAccessPeriod
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
