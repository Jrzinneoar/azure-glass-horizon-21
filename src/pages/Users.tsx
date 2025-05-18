
import React, { useState } from 'react';
import { useAuth, UserRole, User as UserType } from '@/contexts/AuthContext';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Formatar data para exibição
const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString('pt-BR');
};

// Componente para exibir e gerenciar o acesso VM de um usuário
const UserVMAccess = ({ user }: { user: UserType }) => {
  const { virtualMachines, assignVMToUser, removeVMFromUser, updateVMAccessPeriod } = useAuth();
  const [selectedVM, setSelectedVM] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAssignVM = () => {
    if (!selectedVM || !durationDays) {
      toast.error('Por favor, selecione uma VM e duração');
      return;
    }

    assignVMToUser(selectedVM, user.id, parseInt(durationDays));
    setDialogOpen(false);
    setSelectedVM('');
    setDurationDays('30');
    toast.success('VM atribuída com sucesso');
  };

  const handleRemoveAccess = (vmId: string) => {
    removeVMFromUser(vmId, user.id);
    toast.success('Acesso removido com sucesso');
  };

  const handleUpdateAccess = (vmId: string, days: string) => {
    if (!days || parseInt(days) <= 0) {
      toast.error('Por favor, insira um número válido de dias');
      return;
    }

    updateVMAccessPeriod(vmId, user.id, parseInt(days));
    toast.success('Período de acesso atualizado');
  };

  // Obter VMs que o usuário tem acesso
  const userVMAccess = user.vmAccess || [];
  
  // Obter VMs disponíveis para atribuição (excluir as já atribuídas)
  const assignedVMIds = userVMAccess.map(access => access.vmId);
  const availableVMs = virtualMachines.filter(vm => !assignedVMIds.includes(vm.id));

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Acesso às Máquinas Virtuais</h3>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default" disabled={availableVMs.length === 0}>
              Atribuir VM
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-morphism">
            <DialogHeader>
              <DialogTitle>Atribuir VM para {user.username}</DialogTitle>
              <DialogDescription>
                Selecione uma máquina virtual e a duração do acesso
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="vm">Máquina Virtual</label>
                <Select value={selectedVM} onValueChange={setSelectedVM}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a VM" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVMs.map(vm => (
                      <SelectItem key={vm.id} value={vm.id}>{vm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="duration">Duração do Acesso (dias)</label>
                <Input
                  id="duration"
                  type="number"
                  value={durationDays}
                  onChange={e => setDurationDays(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAssignVM}>Atribuir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {userVMAccess.length === 0 ? (
        <div className="text-center py-4 bg-white/5 rounded-md">
          <p className="text-muted-foreground text-sm">Nenhum acesso VM atribuído</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="table-glass">
            <TableHeader>
              <TableRow>
                <TableHead>Máquina Virtual</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userVMAccess.map(access => {
                const vm = virtualMachines.find(vm => vm.id === access.vmId);
                if (!vm) return null;
                
                return (
                  <TableRow key={access.vmId}>
                    <TableCell>{vm.name}</TableCell>
                    <TableCell>{formatDate(access.expiresAt)}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          className="w-16 h-8"
                          defaultValue="30"
                          min="1"
                          id={`days-${access.vmId}`}
                        />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="ml-2"
                          onClick={() => {
                            const input = document.getElementById(`days-${access.vmId}`) as HTMLInputElement;
                            handleUpdateAccess(access.vmId, input.value);
                          }}
                        >
                          Atualizar
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRemoveAccess(access.vmId)}
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

const Users = () => {
  const { users, updateUserRole, user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleChange = (userId: string, role: UserRole) => {
    // Apenas fundador pode mudar o cargo de qualquer um
    // Admin só pode definir outros como cliente
    if (!currentUser) return;

    if (currentUser.role === 'founder' || (currentUser.role === 'admin' && role === 'client')) {
      updateUserRole(userId, role);
      toast.success(`Cargo de usuário atualizado para ${role === 'founder' ? 'Fundador' : role === 'admin' ? 'Admin' : 'Cliente'}`);
    } else {
      toast.error("Você não tem permissão para atribuir este cargo");
    }
  };

  // Filtrar usuários pela pesquisa
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Verificar se o usuário atual é admin ou founder
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

  // Função para mapear role para texto em Português
  const getRoleName = (role: string) => {
    switch(role) {
      case 'founder': return 'Fundador';
      case 'admin': return 'Administrador';
      case 'client': return 'Cliente';
      default: return role;
    }
  };

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
        
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="card-improved">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {user.username}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2 text-sm">
                    <div className="text-muted-foreground">
                      <span>ID do Usuário: </span>
                      <span className="font-mono text-foreground">{user.id}</span>
                    </div>
                    {user.email && (
                      <div className="text-muted-foreground">
                        <span>Email: </span>
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    )}
                    <div className="text-muted-foreground">
                      <span>Cargo Atual: </span>
                      <span className="text-foreground capitalize">{getRoleName(user.role)}</span>
                    </div>
                  </div>
                  
                  <div className="sm:self-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm whitespace-nowrap">Definir Cargo:</span>
                      <Select 
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                        disabled={
                          // Apenas fundador pode alterar cargos, e admin só pode definir cargo de cliente
                          (currentUser?.role !== 'founder' && (user.role !== 'client' || currentUser?.role !== 'admin')) || 
                          // Ninguém pode alterar o cargo do fundador
                          user.id === '1345386650502565998'
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Apenas fundador pode definir cargos de admin e founder */}
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
                
                {/* Mostrar gerenciamento de acesso VM apenas para clientes */}
                {user.role === 'client' && (
                  <UserVMAccess user={user} />
                )}
              </CardContent>
              
              <CardFooter className="flex justify-center border-t border-white/10 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                >
                  {selectedUser?.id === user.id ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
