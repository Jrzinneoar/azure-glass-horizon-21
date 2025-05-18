
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import UserCard from '@/components/users/UserCard';

const Users = () => {
  const { users, user: currentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users by search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Check if the current user is admin or founder
  if (currentUser?.role !== 'admin' && currentUser?.role !== 'founder') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
          <p className="text-muted-foreground">Você não tem permissão para visualizar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pt-24 pb-20 px-4">
      {/* Background brushes */}
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.03)" 
        size={600} 
        className="top-[-100px] left-[-200px] z-0" 
      />
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.02)" 
        size={500} 
        variant={2}
        className="bottom-[-100px] right-[-150px] z-0" 
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie permissões de usuários e acesso às VMs
          </p>
          
          <div className="flex items-center gap-2 w-full max-w-md mt-4 mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuários..."
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id}
              user={user}
              currentUser={currentUser}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
