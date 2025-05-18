
import { useState } from 'react';
import { User, UserRole, VirtualMachine } from '../types/auth.types';
import { mockUsers, mockVirtualMachines } from '../data/mockData';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [virtualMachines, setVirtualMachines] = useState<VirtualMachine[]>(mockVirtualMachines);
  const [isLoading, setIsLoading] = useState(false);

  return {
    user,
    setUser,
    users,
    setUsers,
    virtualMachines,
    setVirtualMachines,
    isLoading,
    setIsLoading,
  };
};
