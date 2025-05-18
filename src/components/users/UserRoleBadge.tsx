
import React from 'react';
import { UserRole } from '@/contexts/types/auth.types';
import { Badge } from '@/components/ui/badge';

interface UserRoleBadgeProps {
  role: UserRole;
}

const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ role }) => {
  // Function to map role to Portuguese text
  const getRoleName = (role: string) => {
    switch(role) {
      case 'founder': return 'Fundador';
      case 'admin': return 'Administrador';
      case 'client': return 'Cliente';
      default: return role;
    }
  };

  // Function to get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'founder': return 'bg-purple-500/20 border-purple-500/50 text-purple-400';
      case 'admin': return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
      case 'client': return 'bg-green-500/20 border-green-500/50 text-green-400';
      default: return '';
    }
  };

  return (
    <Badge className={`${getRoleBadgeColor(role)} px-2 py-0.5`}>
      {getRoleName(role)}
    </Badge>
  );
};

export default UserRoleBadge;
