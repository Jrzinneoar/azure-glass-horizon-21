
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import VMStatusFilter from '@/components/dashboard/VMStatusFilter';
import VMSearchBar from '@/components/dashboard/VMSearchBar';
import VMList from '@/components/dashboard/VMList';
import NoAccessMessage from '@/components/dashboard/NoAccessMessage';

const Dashboard = () => {
  const { user, virtualMachines, getUserVMs, getOwnerName } = useAuth();
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
    
    // All roles (founder, admin, client) can see their VMs
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

  // Add owner name to each VM
  const vmsWithOwners = filteredVMs.map(vm => ({
    ...vm,
    ownerName: getOwnerName(vm.ownerId)
  }));

  // Check if user is admin or founder
  const isAdmin = user?.role === 'admin' || user?.role === 'founder';
  
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
          
          <VMSearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <VMStatusFilter onValueChange={setActiveTab} />
        </Tabs>
        
        <Separator className="mb-6" />
        
        {user && user.role === 'client' && filteredVMs.length === 0 ? (
          <NoAccessMessage />
        ) : filteredVMs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma máquina virtual encontrada</p>
          </div>
        ) : (
          <VMList vms={vmsWithOwners} isAdmin={isAdmin} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
