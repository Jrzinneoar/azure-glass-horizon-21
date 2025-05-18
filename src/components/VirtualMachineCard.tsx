
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, HardDrive, Cpu, Database, User } from 'lucide-react';
import VMStatusBadge from './vm/VMStatusBadge';
import VMInfoItem from './vm/VMInfoItem';
import VMControlButtons from './vm/VMControlButtons';

interface VirtualMachineProps {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  ip: string;
  type: string;
  location: string;
  ownerId?: string;
  ownerName?: string;
}

const VirtualMachineCard: React.FC<VirtualMachineProps> = ({
  id,
  name,
  status: initialStatus,
  ip,
  type,
  location,
  ownerId,
  ownerName,
}) => {
  const [status, setStatus] = useState(initialStatus);
  
  // Function to handle status updates from child components
  const handleStatusChange = (newStatus: 'running' | 'stopped' | 'error') => {
    setStatus(newStatus);
  };

  return (
    <Card className="glass-morphism overflow-hidden group relative border-white/10 hover:border-white/20 transition-all duration-300">
      {/* Decorative corner accent */}
      <div className="absolute right-0 top-0 h-24 w-24 overflow-hidden">
        <div className="w-32 h-32 rotate-45 bg-gradient-to-r from-white/5 to-white/10 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Status indicator line at the top */}
      <div 
        className={`h-1 w-full ${status === 'running' ? 'bg-green-500/50' : status === 'stopped' ? 'bg-gray-500/30' : 'bg-red-500/50'}`}
      />
      
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Server size={16} className="text-white/50" />
          <CardTitle className="text-gradient text-lg font-bold">{name}</CardTitle>
        </div>
        <VMStatusBadge status={status} />
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          <VMInfoItem icon={<HardDrive size={14} className="text-white/50" />} label="IP Address" value={ip} />
          <VMInfoItem icon={<Cpu size={14} className="text-white/50" />} label="Type" value={type} />
          <VMInfoItem icon={<Database size={14} className="text-white/50" />} label="Location" value={location} />
          <VMInfoItem 
            icon={<User size={14} className="text-white/50" />} 
            label="Owner" 
            value={ownerName || "Unassigned"} 
          />
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 flex justify-between border-t border-white/10 mt-2">
        <VMControlButtons 
          vmId={id} 
          vmName={name} 
          status={status} 
        />
      </CardFooter>
    </Card>
  );
};

export default VirtualMachineCard;
