
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import VirtualMachineCard from '@/components/VirtualMachineCard';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for Azure VMs
const mockVMs = [
  {
    id: 'vm-1',
    name: 'Production-Server',
    status: 'running' as const,
    ip: '192.168.1.10',
    type: 'Standard_D2s_v3',
    location: 'East US'
  },
  {
    id: 'vm-2',
    name: 'Dev-Environment',
    status: 'stopped' as const,
    ip: '192.168.1.11',
    type: 'Standard_B2s',
    location: 'West Europe'
  },
  {
    id: 'vm-3',
    name: 'Database-Server',
    status: 'running' as const,
    ip: '192.168.1.12',
    type: 'Standard_E4_v3',
    location: 'Southeast Asia'
  },
  {
    id: 'vm-4',
    name: 'Test-Server',
    status: 'error' as const,
    ip: '192.168.1.13',
    type: 'Standard_B1s',
    location: 'Central US'
  },
  {
    id: 'vm-5',
    name: 'Backup-Server',
    status: 'stopped' as const,
    ip: '192.168.1.14',
    type: 'Standard_D4s_v3',
    location: 'North Europe'
  },
  {
    id: 'vm-6',
    name: 'Analytics-VM',
    status: 'running' as const,
    ip: '192.168.1.15',
    type: 'Standard_F8s_v2',
    location: 'East Asia'
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };
  
  const filteredVMs = mockVMs.filter(vm => {
    // Filter by search
    const matchesSearch = vm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vm.ip.includes(searchQuery);
    
    // Filter by tab                      
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'running' && vm.status === 'running') ||
                       (activeTab === 'stopped' && vm.status === 'stopped') ||
                       (activeTab === 'error' && vm.status === 'error');
                       
    return matchesSearch && matchesTab;
  });
  
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pt-24 pb-8 px-4">
      {/* Background brushes */}
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.03)" 
        size={800} 
        className="top-[-200px] right-[-300px] z-0" 
      />
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.02)" 
        size={600} 
        variant={2}
        className="bottom-[-100px] left-[-200px] z-0" 
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Virtual Machines</h1>
            <p className="text-muted-foreground">
              Monitor and manage your Azure virtual machines
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search VMs by name or IP..."
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="button-glow" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All VMs</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
            <TabsTrigger value="stopped">Stopped</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Separator className="mb-6" />
        
        {filteredVMs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No virtual machines found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVMs.map(vm => (
              <VirtualMachineCard 
                key={vm.id}
                id={vm.id}
                name={vm.name}
                status={vm.status}
                ip={vm.ip}
                type={vm.type}
                location={vm.location}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
