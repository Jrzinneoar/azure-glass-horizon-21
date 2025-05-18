
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import VMAccessActions from './VMAccessActions';
import { VirtualMachine } from '@/contexts/types/auth.types';

interface VMAccessTableProps {
  userVMAccess: Array<{ vmId: string; expiresAt: string }>;
  virtualMachines: VirtualMachine[];
  onUpdateAccess: (vmId: string, newDate: Date) => void;
  onRemoveAccess: (vmId: string) => void;
}

const VMAccessTable: React.FC<VMAccessTableProps> = ({ 
  userVMAccess, 
  virtualMachines, 
  onUpdateAccess, 
  onRemoveAccess 
}) => {
  // Format date for display
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString('pt-BR');
  };

  return (
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
                  <VMAccessActions 
                    vmId={access.vmId} 
                    expiryDate={new Date(access.expiresAt)}
                    onUpdateAccess={onUpdateAccess}
                    onRemoveAccess={onRemoveAccess}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default VMAccessTable;
