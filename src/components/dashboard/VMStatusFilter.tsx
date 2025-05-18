
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VMStatusFilterProps {
  onValueChange: (value: string) => void;
}

const VMStatusFilter: React.FC<VMStatusFilterProps> = ({ onValueChange }) => {
  return (
    <div className="flex justify-center">
      <TabsList>
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="running">Em execução</TabsTrigger>
        <TabsTrigger value="stopped">Paradas</TabsTrigger>
        <TabsTrigger value="error">Erro</TabsTrigger>
      </TabsList>
    </div>
  );
};

export default VMStatusFilter;
