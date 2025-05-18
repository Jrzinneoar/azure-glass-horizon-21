
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface VMAccessActionsProps {
  vmId: string;
  expiryDate: Date;
  onUpdateAccess: (vmId: string, newDate: Date) => void;
  onRemoveAccess: (vmId: string) => void;
}

const VMAccessActions: React.FC<VMAccessActionsProps> = ({ 
  vmId, 
  expiryDate, 
  onUpdateAccess, 
  onRemoveAccess 
}) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            <Calendar size={14} className="mr-2" />
            Atualizar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <CalendarComponent
            mode="single"
            selected={expiryDate}
            onSelect={(newDate) => newDate && onUpdateAccess(vmId, newDate)}
            initialFocus
            className="p-3 pointer-events-auto"
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
      
      <Button 
        size="sm" 
        variant="destructive"
        onClick={() => onRemoveAccess(vmId)}
      >
        Remover
      </Button>
    </>
  );
};

export default VMAccessActions;
