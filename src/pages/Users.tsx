
import React, { useState } from 'react';
import { useAuth, UserRole, User as UserType } from '@/contexts/AuthContext';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

// Format date for display
const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};

// Component to display and manage a user's VM access
const UserVMAccess = ({ user }: { user: UserType }) => {
  const { virtualMachines, assignVMToUser, removeVMFromUser, updateVMAccessPeriod } = useAuth();
  const [selectedVM, setSelectedVM] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAssignVM = () => {
    if (!selectedVM || !durationDays) {
      toast.error('Please select a VM and duration');
      return;
    }

    assignVMToUser(selectedVM, user.id, parseInt(durationDays));
    setDialogOpen(false);
    setSelectedVM('');
    setDurationDays('30');
  };

  const handleRemoveAccess = (vmId: string) => {
    removeVMFromUser(vmId, user.id);
  };

  const handleUpdateAccess = (vmId: string, days: string) => {
    if (!days || parseInt(days) <= 0) {
      toast.error('Please enter a valid number of days');
      return;
    }

    updateVMAccessPeriod(vmId, user.id, parseInt(days));
  };

  // Get VMs the user has access to
  const userVMAccess = user.vmAccess || [];
  
  // Get available VMs for assignment (exclude already assigned ones)
  const assignedVMIds = userVMAccess.map(access => access.vmId);
  const availableVMs = virtualMachines.filter(vm => !assignedVMIds.includes(vm.id));

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold">Virtual Machine Access</h3>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default" disabled={availableVMs.length === 0}>
              Assign VM
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-morphism">
            <DialogHeader>
              <DialogTitle>Assign VM to {user.username}</DialogTitle>
              <DialogDescription>
                Select a virtual machine and access duration
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="vm">Virtual Machine</label>
                <Select value={selectedVM} onValueChange={setSelectedVM}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select VM" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVMs.map(vm => (
                      <SelectItem key={vm.id} value={vm.id}>{vm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="duration">Access Duration (days)</label>
                <Input
                  id="duration"
                  type="number"
                  value={durationDays}
                  onChange={e => setDurationDays(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAssignVM}>Assign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {userVMAccess.length === 0 ? (
        <div className="text-center py-4 bg-white/5 rounded-md">
          <p className="text-muted-foreground text-sm">No VM access assigned</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Virtual Machine</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userVMAccess.map(access => {
                const vm = virtualMachines.find(vm => vm.id === access.vmId);
                if (!vm) return null;
                
                return (
                  <TableRow key={access.vmId}>
                    <TableCell>{vm.name}</TableCell>
                    <TableCell>{formatDate(access.expiresAt)}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Input
                          type="number"
                          className="w-16 h-8"
                          defaultValue="30"
                          min="1"
                          id={`days-${access.vmId}`}
                        />
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="ml-2"
                          onClick={() => {
                            const input = document.getElementById(`days-${access.vmId}`) as HTMLInputElement;
                            handleUpdateAccess(access.vmId, input.value);
                          }}
                        >
                          Update
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRemoveAccess(access.vmId)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

const Users = () => {
  const { users, updateUserRole, user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const handleRoleChange = (userId: string, role: UserRole) => {
    // Only founder can change anyone's role
    // Admin can only set others to client
    if (!currentUser) return;

    if (currentUser.role === 'founder' || (currentUser.role === 'admin' && role === 'client')) {
      updateUserRole(userId, role);
    } else {
      toast.error("You don't have permission to assign this role");
    }
  };

  // Check if current user is admin or founder
  if (currentUser?.role !== 'admin' && currentUser?.role !== 'founder') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pt-24 pb-8 px-4">
      {/* Background brushes */}
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.03)" 
        size={600} 
        className="top-[-100px] left-[-200px] z-0" 
      />
      <AnimatedBrush 
        color="rgba(255, 255, 255, 0.02)" 
        size={500} 
        variant={2}
        className="bottom-[-100px] right-[-150px] z-0" 
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient">User Management</h1>
          <p className="text-muted-foreground">
            View and manage user permissions and VM access
          </p>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="glass-morphism">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {user.username}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2 text-sm">
                    <div className="text-muted-foreground">
                      <span>User ID: </span>
                      <span className="font-mono text-foreground">{user.id}</span>
                    </div>
                    {user.email && (
                      <div className="text-muted-foreground">
                        <span>Email: </span>
                        <span className="text-foreground">{user.email}</span>
                      </div>
                    )}
                    <div className="text-muted-foreground">
                      <span>Current Role: </span>
                      <span className="text-foreground capitalize">{user.role}</span>
                    </div>
                  </div>
                  
                  <div className="sm:self-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm whitespace-nowrap">Set Role:</span>
                      <Select 
                        defaultValue={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                        disabled={
                          // Only founder can change roles, and admin can only set client role
                          (currentUser?.role !== 'founder' && (user.role !== 'client' || currentUser?.role !== 'admin')) || 
                          // Nobody can change the founder's role
                          user.id === '1345386650502565998'
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Only founder can set admin and founder roles */}
                          {currentUser?.role === 'founder' && (
                            <>
                              <SelectItem value="founder">Founder</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </>
                          )}
                          <SelectItem value="client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Only show VM access management for clients */}
                {user.role === 'client' && (
                  <UserVMAccess user={user} />
                )}
              </CardContent>
              
              <CardFooter className="flex justify-center border-t border-white/10 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                >
                  {selectedUser?.id === user.id ? 'Hide Details' : 'Show Details'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
