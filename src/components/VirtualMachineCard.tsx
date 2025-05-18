
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Power, Info } from 'lucide-react';
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
  
  return (
    <Card className="glass-morphism overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-gradient text-lg">{name}</CardTitle>
          <Badge 
            variant={status === 'running' ? 'default' : status === 'stopped' ? 'secondary' : 'destructive'}
            className={`${status === 'running' ? 'animate-pulse-glow' : ''}`}
          >
            {status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>IP Address</span>
            <span className="font-mono">{ip}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Type</span>
            <span>{type}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Location</span>
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
      
      <div className="absolute right-0 top-0 h-20 w-20 group-hover:opacity-100 opacity-0 transition-opacity">
        <div className="w-28 h-28 rotate-45 bg-gradient-to-r from-white/5 to-white/10 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <CardFooter className="pt-0 flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="button-glow">
                <Info size={16} />
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
