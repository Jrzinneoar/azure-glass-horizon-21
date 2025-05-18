
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/sonner';

const Settings = () => {
  const { user } = useAuth();
  
  const handleSave = () => {
    toast.success("Settings saved successfully");
  };
  
  // Only founder can access settings
  if (user?.role !== 'founder') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Only founders can access settings</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pt-24 pb-8 px-4">
      {/* Background brushes */}
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.03)" 
        size={700} 
        className="top-[-200px] right-[-300px] z-0" 
      />
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.02)" 
        size={500} 
        variant={2}
        className="bottom-[-100px] left-[-150px] z-0" 
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient">Settings</h1>
          <p className="text-muted-foreground">
            Configure your Azure Monitor application
          </p>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="space-y-8">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Azure Credentials</CardTitle>
              <CardDescription>
                Configure your Azure connection settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Tenant ID</Label>
                  <Input id="tenantId" placeholder="Enter your Azure Tenant ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subscriptionId">Subscription ID</Label>
                  <Input id="subscriptionId" placeholder="Enter your Azure Subscription ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client ID</Label>
                  <Input id="clientId" placeholder="Enter your Azure Client ID" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input id="clientSecret" type="password" placeholder="Enter your Azure Client Secret" />
                </div>
              </div>
              
              <div className="pt-2">
                <Button onClick={handleSave}>
                  Save Azure Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoRefresh">Auto-refresh</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh VM status every 60 seconds
                  </p>
                </div>
                <Switch id="autoRefresh" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when VM status changes
                  </p>
                </div>
                <Switch id="notifications" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="darkMode">Dark mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Always use dark theme
                  </p>
                </div>
                <Switch id="darkMode" defaultChecked />
              </div>
              
              <div className="pt-2">
                <Button onClick={handleSave}>
                  Save Application Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
