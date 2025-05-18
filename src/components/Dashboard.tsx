
import React from 'react';
import { VirtualMachine } from '@/contexts/types/auth.types';
import { useAuth } from '@/contexts/AuthContext';
import VirtualMachineCard from './VirtualMachineCard';
import AnimatedBrush from './AnimatedBrush';
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { virtualMachines, user } = useAuth();

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

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient">Virtual Machines Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your virtual machines and their configurations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {virtualMachines.map((vm) => (
            <VirtualMachineCard
              key={vm.id}
              id={vm.id}
              name={vm.name}
              status={vm.status}
              ip={vm.ip}
              type={vm.type}
              location={vm.location}
              ownerId={vm.ownerId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
