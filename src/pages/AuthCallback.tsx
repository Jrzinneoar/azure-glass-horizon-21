
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { loginWithDiscordCode } = useAuth();

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
        // Process the authentication with the received code
        await loginWithDiscordCode(code);
        
        // Redirect to dashboard after successful login
        navigate('/dashboard');
        toast.success('Successfully logged in!');
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication failed');
        toast.error('Failed to log in with Discord');
        setTimeout(() => navigate('/'), 2000);
      }
    };
    
    handleCallback();
  }, [navigate, loginWithDiscordCode]);

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
