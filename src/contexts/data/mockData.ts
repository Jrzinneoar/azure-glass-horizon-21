
import { User, VirtualMachine } from '../types/auth.types';

// Dados mockados para simular usuários
export const mockUsers: User[] = [
  {
    id: "1345386650502565998",
    username: "Fundador",
    email: "fundador@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    role: "founder",
  },
  {
    id: "2",
    username: "Admin",
    email: "admin@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    role: "admin",
  },
  {
    id: "3",
    username: "Cliente1",
    email: "cliente1@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    role: "client",
    vmAccess: [
      { 
        vmId: "vm1",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "4",
    username: "Cliente2",
    email: "cliente2@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    role: "client",
  },
];

// Dados mockados para simular máquinas virtuais
export const mockVirtualMachines: VirtualMachine[] = [
  {
    id: "vm1",
    name: "VM de Produção",
    status: "running",
    ip: "192.168.1.100",
    type: "Standard_DS3_v2",
    location: "Brazil South",
    ownerId: "3" // Pertence ao Cliente1
  },
  {
    id: "vm2",
    name: "VM de Homologação",
    status: "stopped",
    ip: "192.168.1.101",
    type: "Standard_DS2_v2",
    location: "Brazil South",
  },
  {
    id: "vm3",
    name: "VM de Desenvolvimento",
    status: "error",
    ip: "192.168.1.102",
    type: "Standard_DS1_v2",
    location: "Brazil South",
  },
  {
    id: "vm4",
    name: "VM de Teste",
    status: "running",
    ip: "192.168.1.103",
    type: "Standard_B2s",
    location: "East US",
  },
];
