
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
import { cn } from '@/lib/utils';
import { VirtualMachine } from '@/contexts/types/auth.types';

interface VMAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableVMs: VirtualMachine[];
  onAssignVM: (vmId: string) => void;
}

const VMAssignmentDialog: React.FC<VMAssignmentDialogProps> = ({ 
  open, 
  onOpenChange, 
  availableVMs, 
  onAssignVM 
}) => {
  const [selectedVM, setSelectedVM] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Filter VMs by search query
  const filteredAvailableVMs = availableVMs.filter(vm => 
    vm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    vm.ip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignVM = () => {
    if (!selectedVM) {
      toast.error('Por favor, selecione uma VM');
      return;
    }

    onAssignVM(selectedVM);
    onOpenChange(false);
    setSelectedVM('');
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism">
        <DialogHeader>
          <DialogTitle>Atribuir VM</DialogTitle>
          <DialogDescription>
            Selecione uma máquina virtual e a data de expiração
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="vm-search">Buscar VM</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="vm-search"
                placeholder="Buscar por nome ou IP..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="vm">Máquina Virtual</label>
            <Select value={selectedVM} onValueChange={setSelectedVM}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a VM" />
              </SelectTrigger>
              <SelectContent>
                {filteredAvailableVMs.map(vm => (
                  <SelectItem key={vm.id} value={vm.id}>{vm.name} ({vm.ip})</SelectItem>
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
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleAssignVM}>Atribuir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VMAssignmentDialog;
