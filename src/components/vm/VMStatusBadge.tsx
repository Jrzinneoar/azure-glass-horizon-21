
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface VMStatusBadgeProps {
  status: 'running' | 'stopped' | 'error';
}

const VMStatusBadge: React.FC<VMStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch(status) {
      case 'running': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'stopped': return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
      case 'error': return 'bg-red-500/20 border-red-500/50 text-red-400';
      default: return '';
    }
  };

  return (
    <Badge 
      className={`${getStatusColor()} px-3 py-1 ${status === 'running' ? 'animate-pulse-glow' : ''}`}
    >
      {status}
    </Badge>
  );
};

export default VMStatusBadge;
