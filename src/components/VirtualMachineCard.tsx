
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Power, Info, HardDrive, Cpu, Server, Database } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VirtualMachineProps {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  ip: string;
  type: string;
  location: string;
}

const VirtualMachineCard: React.FC<VirtualMachineProps> = ({
  id,
  name,
  status: initialStatus,
  ip,
  type,
  location
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePowerAction = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newStatus = status === 'running' ? 'stopped' : 'running';
    setStatus(newStatus);
    
    toast.success(`Virtual machine ${name} ${newStatus === 'running' ? 'started' : 'stopped'} successfully`);
    setIsLoading(false);
  };

  // Determine status color
  const getStatusColor = () => {
    switch(status) {
      case 'running': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'stopped': return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return '';
    }
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
        <Badge 
          className={`${getStatusColor()} px-3 py-1 ${status === 'running' ? 'animate-pulse-glow' : ''}`}
        >
          {status}
        </Badge>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="text-white/50" />
              <span className="text-sm text-white/80">IP Address</span>
            </div>
            <span className="font-mono text-sm text-white/90">{ip}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-white/50" />
              <span className="text-sm text-white/80">Type</span>
            </div>
            <span className="text-sm text-white/90">{type}</span>
          </div>
          
          <div className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-white/50" />
              <span className="text-sm text-white/80">Location</span>
            </div>
            <span className="text-sm text-white/90">{location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 flex justify-between border-t border-white/10 mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="button-glow">
                <Info size={16} />
                <span className="ml-2">Details</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View details for {name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
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
      </CardFooter>
    </Card>
  );
};

export default VirtualMachineCard;
