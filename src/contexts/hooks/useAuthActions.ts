
import { useCallback } from 'react';
import { User, UserRole, VirtualMachine } from '../types/auth.types';

interface AuthActionsProps {
  user: User | null;
  setUser: (user: User | null) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  virtualMachines: VirtualMachine[];
  setVirtualMachines: (vms: VirtualMachine[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthActions = ({
  user,
  setUser,
  users,
  setUsers,
  virtualMachines,
  setVirtualMachines,
  setIsLoading
}: AuthActionsProps) => {
  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simulando um login com o usuário fundador
      // No mundo real, isso viria de uma API de autenticação
      const foundUser = users.find(u => u.id === "1345386650502565998");
      if (foundUser) {
        // Garantir que o avatar está sendo carregado para o usuário fundador
        setUser({
          ...foundUser,
          avatarUrl: foundUser.avatarUrl || "https://github.com/shadcn.png"
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  }, [users, setUser, setIsLoading]);

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const updateUserRole = useCallback((userId: string, role: UserRole) => {
    setUsers((prevUsers: User[]) => 
      prevUsers.map(u => 
        u.id === userId ? { ...u, role } : u
      )
    );
  }, [setUsers]);
  
  const getOwnerName = useCallback((ownerId?: string) => {
    if (!ownerId) return undefined;
    const owner = users.find(u => u.id === ownerId);
    return owner ? owner.username : undefined;
  }, [users]);

  const getUserVMs = useCallback((userId: string) => {
    if (!user) return [];
    
    // Se for admin ou founder, retorna todas as VMs
    if (user.role === 'admin' || user.role === 'founder') {
      return virtualMachines.map(vm => ({
        ...vm,
        ownerName: getOwnerName(vm.ownerId)
      }));
    }
    
    // Para clientes, verificar as VMs com acesso não expirado
    const userObj = users.find(u => u.id === userId);
    if (!userObj || !userObj.vmAccess) return [];
    
    const currentDate = new Date();
    const validVMAccess = userObj.vmAccess.filter(access => {
      const expiryDate = new Date(access.expiresAt);
      return expiryDate > currentDate;
    });
    
    const vmIds = validVMAccess.map(access => access.vmId);
    return virtualMachines.filter(vm => vmIds.includes(vm.id)).map(vm => ({
      ...vm,
      ownerName: getOwnerName(vm.ownerId)
    }));
  }, [user, users, virtualMachines, getOwnerName]);

  const assignVMToUser = useCallback((vmId: string, userId: string, durationDays: number) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);
    
    setUsers((prevUsers: User[]) => 
      prevUsers.map(u => {
        if (u.id === userId) {
          const vmAccess = u.vmAccess || [];
          return {
            ...u,
            vmAccess: [
              ...vmAccess,
              {
                vmId,
                expiresAt: expiryDate.toISOString()
              }
            ]
          };
        }
        return u;
      })
    );

    setVirtualMachines((prevVMs: VirtualMachine[]) => 
      prevVMs.map(vm => 
        vm.id === vmId ? { ...vm, ownerId: userId } : vm
      )
    );
  }, [setUsers, setVirtualMachines]);

  const removeVMFromUser = useCallback((vmId: string, userId: string) => {
    setUsers((prevUsers: User[]) => 
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

    setVirtualMachines((prevVMs: VirtualMachine[]) => 
      prevVMs.map(vm => 
        vm.id === vmId ? { ...vm, ownerId: undefined } : vm
      )
    );
  }, [setUsers, setVirtualMachines]);

  const updateVMAccessPeriod = useCallback((vmId: string, userId: string, days: number) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    
    setUsers((prevUsers: User[]) => 
      prevUsers.map(u => {
        if (u.id === userId && u.vmAccess) {
          return {
            ...u,
            vmAccess: u.vmAccess.map(access => 
              access.vmId === vmId 
                ? { ...access, expiresAt: expiryDate.toISOString() } 
                : access
            )
          };
        }
        return u;
      })
    );
  }, [setUsers]);

  return {
    login,
    logout,
    updateUserRole,
    getUserVMs,
    assignVMToUser,
    removeVMFromUser,
    updateVMAccessPeriod,
    getOwnerName
  };
};
