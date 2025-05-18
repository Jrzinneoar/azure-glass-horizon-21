
import React, { useState } from 'react';
import { User } from '@/contexts/types/auth.types';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

// Format date for display
const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString('pt-BR');
};

interface UserVMAccessProps {
  user: User;
}

const UserVMAccess: React.FC<UserVMAccessProps> = ({ user }) => {
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
                      <CalendarIcon className="mr-2 h-4 w-4" />
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

export default UserVMAccess;
