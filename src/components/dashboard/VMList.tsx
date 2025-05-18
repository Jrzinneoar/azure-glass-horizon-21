
import React from 'react';
import VirtualMachineCard from '@/components/VirtualMachineCard';

interface VMListProps {
  vms: Array<{
    id: string;
    name: string;
    status: 'running' | 'stopped' | 'error';
    ip: string;
    type: string;
    location: string;
    ownerId?: string;
    ownerName?: string;
  }>;
  isAdmin: boolean;
}

const VMList: React.FC<VMListProps> = ({ vms, isAdmin }) => {
  if (vms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma máquina virtual encontrada</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vms.map(vm => (
        <VirtualMachineCard
          key={vm.id}
          id={vm.id}
          name={vm.name}
          status={vm.status}
          ip={vm.ip}
          type={vm.type}
          location={vm.location}
          ownerId={vm.ownerId}
          ownerName={vm.ownerName}
        />
      ))}
    </div>
  );
};

export default VMList;
