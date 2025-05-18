
import React, { useState } from 'react';
import { Power, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import VMAssignDialog from './VMAssignDialog';

interface VMControlButtonsProps {
  vmId: string;
  vmName: string;
  status: 'running' | 'stopped' | 'error';
}

const VMControlButtons: React.FC<VMControlButtonsProps> = ({ vmId, vmName, status }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const handlePowerAction = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newStatus = status === 'running' ? 'stopped' : 'running';
    
    toast.success(`Virtual machine ${vmName} ${newStatus === 'running' ? 'started' : 'stopped'} successfully`);
    setIsLoading(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="button-glow"
        onClick={() => setAssignDialogOpen(true)}
      >
        <Calendar size={16} />
        <span className="ml-2">Assign VM</span>
      </Button>
      
      <Button 
        variant={status === 'running' ? 'destructive' : 'default'}
        size="sm"
        disabled={isLoading || status === 'error'}
        onClick={handlePowerAction}
        className="button-glow"
      >
        <Power size={16} className="mr-2" />
        {status === 'running' ? 'Stop' : 'Start'}
      </Button>
      
      <VMAssignDialog 
        vmId={vmId}
        vmName={vmName}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
    </>
  );
};

export default VMControlButtons;
