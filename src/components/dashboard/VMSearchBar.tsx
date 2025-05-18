
import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface VMSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const VMSearchBar: React.FC<VMSearchBarProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onRefresh, 
  isRefreshing 
}) => {
  return (
    <div className="flex items-center gap-2 w-full max-w-md mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar VMs por nome ou IP..."
          className="pl-8"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        size="icon" 
        className="button-glow rounded-full" 
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default VMSearchBar;
