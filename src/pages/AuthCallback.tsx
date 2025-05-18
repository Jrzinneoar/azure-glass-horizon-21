
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { useAuth, User } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { users } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code) {
        setError('Authorization code not found');
        toast.error('Failed to log in with Discord');
        setTimeout(() => navigate('/'), 2000);
        return;
      }
      
      try {
        // In a real app, we would exchange the code for a token
        // For now, we'll simulate authentication success
        await simulateTokenExchange(code);
        
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication failed');
        toast.error('Failed to log in with Discord');
        setTimeout(() => navigate('/'), 2000);
      }
    };
    
    handleCallback();
  }, [navigate]);
  
  // Simulate token exchange - in a real app this would call Discord's API
  const simulateTokenExchange = async (code: string): Promise<void> => {
    // This simulates exchanging the code for a token and user data
    // In a real app, we'd make API calls to Discord
    
    // For demo purposes, let's randomly pick a user from our mock data
    // In a real app, the Discord API would return the actual user data
    const randomIndex = Math.floor(Math.random() % users.length);
    const mockUser = users[randomIndex] as User;
    
    // Store a fake token with the user ID for our auth context to use
    localStorage.setItem('discord_token', `${mockUser.id}_fake_token`);
    
    // Simulate network delay
    return new Promise((resolve) => setTimeout(resolve, 1500));
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <p className="mt-4">Redirecting to home page...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Authenticating with Discord</h1>
          <p className="text-muted-foreground mt-2">Please wait...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
