
import React, { useState } from 'react';
import { Search, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { VirtualMachine } from '@/contexts/types/auth.types';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  const [selectedVM, setSelectedVM] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter VMs based on search query
  const filteredVMs = availableVMs.filter(vm => 
    vm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vm.ip.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedVM) {
      toast.error("Please select a VM to assign");
      return;
    }
    
    onAssignVM(selectedVM);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-morphism">
        <DialogHeader>
          <DialogTitle>Assign VM Access</DialogTitle>
          <DialogDescription>
            Select a virtual machine to assign to this user
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex flex-col space-y-4">
          <div>
            <label className="text-sm mb-2 block">Search VM:</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search VMs by name or IP..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm mb-2 block">Select VM:</label>
            <Select value={selectedVM} onValueChange={setSelectedVM}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a VM" />
              </SelectTrigger>
              <SelectContent>
                {filteredVMs.map((vm) => (
                  <SelectItem key={vm.id} value={vm.id}>
                    {vm.name} - {vm.ip} ({vm.type})
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
                    !expirationDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {expirationDate ? format(expirationDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={expirationDate}
                  onSelect={setExpirationDate}
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
          <Button onClick={handleAssign}>Assign VM</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VMAssignmentDialog;
