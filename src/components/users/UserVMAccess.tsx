
import React, { useState } from 'react';
import { User } from '@/contexts/types/auth.types';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import VMAccessTable from './vm-access/VMAccessTable';
import VMAssignmentDialog from './vm-access/VMAssignmentDialog';

interface UserVMAccessProps {
  user: User;
}

const UserVMAccess: React.FC<UserVMAccessProps> = ({ user }) => {
  const { virtualMachines, assignVMToUser, removeVMFromUser, updateVMAccessPeriod } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAssignVM = (selectedVM: string) => {
    const days = 30; // Default to 30 days if no date is selected
    assignVMToUser(selectedVM, user.id, days);
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
        
        <Button 
          size="sm" 
          variant="default" 
          disabled={availableVMs.length === 0} 
          className="glass-morphism"
          onClick={() => setDialogOpen(true)}
        >
          <Calendar size={16} className="mr-2" />
          Atribuir VM
        </Button>
      </div>
      
      {userVMAccess.length === 0 ? (
        <div className="text-center py-4 bg-white/5 rounded-md">
          <p className="text-muted-foreground text-sm">Nenhum acesso VM atribuído</p>
        </div>
      ) : (
        <VMAccessTable 
          userVMAccess={userVMAccess}
          virtualMachines={virtualMachines}
          onUpdateAccess={handleUpdateAccess}
          onRemoveAccess={handleRemoveAccess}
        />
      )}

      <VMAssignmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        availableVMs={availableVMs}
        onAssignVM={handleAssignVM}
      />
    </div>
  );
};

export default UserVMAccess;
