
export interface VMAccess {
  vmId: string;
  expiresAt: string;
}

export type UserRole = 'client' | 'admin' | 'founder';

export interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl: string;
  role: UserRole;
  vmAccess?: VMAccess[];
  discordId?: string;
  createdAt?: Date;
}

export interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  ip: string;
  type: string;
  location: string;
  ownerId?: string; // ID do usuário proprietário
}
