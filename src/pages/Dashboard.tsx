
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import VMStatusFilter from '@/components/dashboard/VMStatusFilter';
import VMSearchBar from '@/components/dashboard/VMSearchBar';
import VMList from '@/components/dashboard/VMList';
import NoAccessMessage from '@/components/dashboard/NoAccessMessage';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, virtualMachines, getUserVMs, getOwnerName } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading to show animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };
  
  // Get VMs based on user role
  const getAvailableVMs = () => {
    if (!user) return [];
    
    // All users (founder, admin, client) can see their VMs
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
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pt-24 pb-20 px-4">
      {/* Enhanced background brushes */}
      <AnimatedBrush 
        color="rgba(149, 128, 255, 0.03)" 
        size={800} 
        className="top-[-200px] right-[-300px] z-0" 
      />
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.02)" 
        size={600} 
        variant={2}
        className="bottom-[-100px] left-[-200px] z-0" 
      />
      <AnimatedBrush 
        color="rgba(149, 128, 255, 0.02)" 
        size={700} 
        className="top-[40%] left-[-30%] z-0" 
      />
      
      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        <motion.div 
          className="flex flex-col items-center text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-br from-white via-white/90 to-purple-300 bg-clip-text text-transparent">
            Máquinas Virtuais
          </h1>
          <p className="text-muted-foreground">
            Monitore e gerencie suas máquinas virtuais Azure
          </p>
          
          <motion.div 
            className="w-full max-w-md mt-4"
            variants={itemVariants}
          >
            <VMSearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </motion.div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <VMStatusFilter onValueChange={setActiveTab} />
          </Tabs>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Separator className="mb-6 bg-white/10" />
        </motion.div>
        
        {user && user.role === 'client' && filteredVMs.length === 0 ? (
          <motion.div variants={itemVariants}>
            <NoAccessMessage />
          </motion.div>
        ) : filteredVMs.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <p className="text-muted-foreground">Nenhuma máquina virtual encontrada</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <VMList vms={vmsWithOwners} isAdmin={isAdmin} />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
