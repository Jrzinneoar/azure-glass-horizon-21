
import React from 'react';
import { User, UserRole } from '@/contexts/types/auth.types';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Key, Mail, Shield } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import UserRoleBadge from './UserRoleBadge';
import UserVMAccess from './UserVMAccess';

interface UserCardProps {
  user: User;
  currentUser: User | null;
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  currentUser,
  selectedUserId,
  onSelectUser
}) => {
  const { updateUserRole } = useAuth();

  const handleRoleChange = (userId: string, role: UserRole) => {
    // Only founder can change anyone's role
    // Admin can only set others as client
    if (!currentUser) return;

    if (currentUser.role === 'founder' || (currentUser.role === 'admin' && role === 'client')) {
      updateUserRole(userId, role);
      toast.success(`Cargo de usuário atualizado para ${role === 'founder' ? 'Fundador' : role === 'admin' ? 'Admin' : 'Cliente'}`);
    } else {
      toast.error("Você não tem permissão para atribuir este cargo");
    }
  };

  const isSelected = selectedUserId === user.id;

  return (
    <Card key={user.id} className="card-improved overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32">
        <div className="w-full h-full rotate-45 translate-x-16 -translate-y-16 bg-gradient-to-r from-transparent to-white/5"></div>
      </div>
      
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-white/10">
          <AvatarImage src={user.avatarUrl} alt={user.username} />
          <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-gradient text-xl">{user.username}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <UserRoleBadge role={user.role} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="space-y-3">
            <div className="flex items-center p-2 rounded-md bg-white/5 border border-white/10">
              <Key size={14} className="text-white/50 mr-2" />
              <span className="text-sm text-white/80">ID:</span>
              <span className="font-mono text-sm ml-2 text-white/90 truncate">{user.id}</span>
            </div>
            
            {user.email && (
              <div className="flex items-center p-2 rounded-md bg-white/5 border border-white/10">
                <Mail size={14} className="text-white/50 mr-2" />
                <span className="text-sm text-white/80">Email:</span>
                <span className="text-sm ml-2 text-white/90">{user.email}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2 p-2 rounded-md bg-white/5 border border-white/10">
              <Shield size={14} className="text-white/50" />
              <span className="text-sm text-white/80">Definir Cargo:</span>
              <Select 
                defaultValue={user.role}
                onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                disabled={
                  (currentUser?.role !== 'founder' && (user.role !== 'client' || currentUser?.role !== 'admin')) || 
                  user.id === '1345386650502565998'
                }
              >
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue placeholder="Cargo" />
                </SelectTrigger>
                <SelectContent>
                  {currentUser?.role === 'founder' && (
                    <>
                      <SelectItem value="founder">Fundador</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </>
                  )}
                  <SelectItem value="client">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className={`mt-4 overflow-hidden transition-all duration-300 ${isSelected ? 'max-h-[1000px]' : 'max-h-0'}`}>
          {/* Mostrar gerenciamento de acesso VM apenas para clientes */}
          {user.role === 'client' && <UserVMAccess user={user} />}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t border-white/10 pt-4">
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full glass-morphism"
          onClick={() => onSelectUser(isSelected ? null : user.id)}
        >
          {isSelected ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
