
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
import { Search, Calendar, User, Shield, Mail, Key } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Format date for display
const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString('pt-BR');
};

// Component to display and manage the VM access of a user
const UserVMAccess = ({ user }: { user: UserType }) => {
  const { virtualMachines, assignVMToUser, removeVMFromUser, updateVMAccessPeriod } = useAuth();
  const [selectedVM, setSelectedVM] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleAssignVM = () => {
    if (!selectedVM) {
      toast.error('Por favor, selecione uma VM');
      return;
    }

    const days = date ? Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 30;
    
    assignVMToUser(selectedVM, user.id, days > 0 ? days : 1);
    setDialogOpen(false);
    setSelectedVM('');
    toast.success('VM atribuída com sucesso');
  };

  const handleRemoveAccess = (vmId: string) => {
    removeVMFromUser(vmId, user.id);
    toast.success('Acesso removido com sucesso');
  };

  const handleUpdateAccess = (vmId: string, newDate: Date) => {
    const days = Math.ceil((newDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
      toast.error('Por favor, selecione uma data futura');
      return;
    }

    updateVMAccessPeriod(vmId, user.id, days);
    toast.success('Período de acesso atualizado');
  };

  // Get VMs that the user has access to
  const userVMAccess = user.vmAccess || [];
  
  // Get VMs available for assignment (exclude already assigned ones)
  const assignedVMIds = userVMAccess.map(access => access.vmId);
  const availableVMs = virtualMachines.filter(vm => !assignedVMIds.includes(vm.id));

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Acesso às Máquinas Virtuais</h3>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default" disabled={availableVMs.length === 0} className="glass-morphism">
              <Calendar size={16} className="mr-2" />
              Atribuir VM
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-morphism">
            <DialogHeader>
              <DialogTitle>Atribuir VM para {user.username}</DialogTitle>
              <DialogDescription>
                Selecione uma máquina virtual e a data de expiração
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
                <label htmlFor="expiry">Data de Expiração</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="expiry"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Selecione a data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Calendar size={14} className="mr-2" />
                            Atualizar
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={new Date(access.expiresAt)}
                            onSelect={(newDate) => newDate && handleUpdateAccess(access.vmId, newDate)}
                            initialFocus
                            className="p-3 pointer-events-auto"
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
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
                    <Badge className={`${getRoleBadgeColor(user.role)} px-2 py-0.5`}>
                      {getRoleName(user.role)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-3">
                    <div className="flex items-center p-2 rounded-md bg-white/5 border border-white/10">
                      <Key size={14} className="text-white/50 mr-2" />
                      <span className="text-sm text-white/80">ID:</span>
                      <span className="font-mono text-sm ml-2 text-white/90">{user.id}</span>
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
                
                <div className={`mt-4 overflow-hidden transition-all duration-300 ${selectedUser?.id === user.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                  {/* Mostrar gerenciamento de acesso VM apenas para clientes */}
                  {user.role === 'client' && <UserVMAccess user={user} />}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center border-t border-white/10 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="rounded-full glass-morphism"
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
