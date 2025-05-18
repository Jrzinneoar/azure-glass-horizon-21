
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { Power, Calendar, HardDrive, Cpu, Server, Database, User } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/contexts/types/auth.types';
import { useAuth } from '@/contexts/AuthContext';

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
  const [isLoading, setIsLoading] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { users, assignVMToUser } = useAuth();
  
  const handlePowerAction = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newStatus = status === 'running' ? 'stopped' : 'running';
    setStatus(newStatus);
    
    toast.success(`Virtual machine ${name} ${newStatus === 'running' ? 'started' : 'stopped'} successfully`);
    setIsLoading(false);
  };

  const handleAssign = () => {
    if (selectedDate && selectedUserId) {
      const days = Math.ceil((selectedDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      assignVMToUser(id, selectedUserId, days > 0 ? days : 1);
      setAssignDialogOpen(false);
      toast.success(`VM ${name} has been assigned until ${format(selectedDate, 'PPP')}`);
    } else {
      toast.error("Por favor, selecione um usuário e uma data");
    }
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
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
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

          <div className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/10">
            <div className="flex items-center gap-2">
              <User size={14} className="text-white/50" />
              <span className="text-sm text-white/80">Owner</span>
            </div>
            <span className="text-sm text-white/90">{ownerName || "Unassigned"}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 flex justify-between border-t border-white/10 mt-2">
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="button-glow">
              <Calendar size={16} />
              <span className="ml-2">Assign VM</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-morphism">
            <DialogHeader>
              <DialogTitle>Assign {name} to a User</DialogTitle>
              <DialogDescription>
                Select a user and expiration date for VM access
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 flex flex-col space-y-4">
              <div>
                <label className="text-sm mb-2 block">Search user:</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm mb-2 block">Select user:</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Select access expiration date:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAssign}>Assign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
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
