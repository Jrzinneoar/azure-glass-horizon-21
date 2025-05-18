
import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import AnimatedBrush from '@/components/AnimatedBrush';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

const Users = () => {
  const { users, updateUserRole, user: currentUser } = useAuth();

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient">User Management</h1>
          <p className="text-muted-foreground">
            View and manage user permissions
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
