
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import VirtualMachineCard from '@/components/VirtualMachineCard';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, virtualMachines, getUserVMs, users } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };
  
  // Get VMs based on user role
  const getAvailableVMs = () => {
    if (!user) return [];
    
    // Admin and founder can see all VMs
    if (user.role === 'admin' || user.role === 'founder') {
      return virtualMachines;
    }
    
    // Clients can only see VMs they have access to
    return getUserVMs(user.id);
  };
  
  const availableVMs = getAvailableVMs();
  
  const filteredVMs = availableVMs.filter(vm => {
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

  // Função para obter o nome do usuário proprietário da VM
  const getOwnerName = (ownerId: string | undefined) => {
    if (!ownerId) return "Não atribuída";
    const owner = users.find(user => user.id === ownerId);
    return owner ? owner.username : "Desconhecido";
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pt-24 pb-20 px-4">
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
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">Máquinas Virtuais</h1>
          <p className="text-muted-foreground">
            Monitore e gerencie suas máquinas virtuais Azure
          </p>
          
          <div className="flex items-center gap-2 w-full max-w-md mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar VMs por nome ou IP..."
                className="pl-8"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className="button-glow rounded-full" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="running">Em execução</TabsTrigger>
              <TabsTrigger value="stopped">Paradas</TabsTrigger>
              <TabsTrigger value="error">Erro</TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
        
        <Separator className="mb-6" />
        
        {user && user.role === 'client' && filteredVMs.length === 0 ? (
          <div className="text-center py-12 glass-morphism p-8 rounded-lg mx-auto max-w-md">
            <h3 className="text-lg font-semibold mb-2 text-gradient">Sem Acesso às Máquinas Virtuais</h3>
            <p className="text-muted-foreground">
              Você não tem acesso a nenhuma máquina virtual no momento. Por favor, entre em contato com um administrador para solicitar acesso.
            </p>
          </div>
        ) : filteredVMs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma máquina virtual encontrada</p>
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
                // Passe o nome do proprietário como metadados extras
                extraInfo={
                  (user?.role === 'admin' || user?.role === 'founder') 
                    ? { 
                      ownerLabel: "Proprietário:",
                      ownerName: getOwnerName(vm.ownerId)
                    } 
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
