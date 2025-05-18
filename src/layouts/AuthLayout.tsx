
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import FloatingNavbar from "@/components/FloatingNavbar";

interface AuthLayoutProps {
  children: React.ReactNode;
  requiredRole?: 'founder' | 'admin' | 'client';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    const hasPermission = 
      user.role === requiredRole || 
      (requiredRole === 'admin' && user.role === 'founder') ||
      (requiredRole === 'client' && (user.role === 'admin' || user.role === 'founder'));
    
    if (!hasPermission) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen">
      <FloatingNavbar />
      {children}
    </div>
  );
};

export default AuthLayout;
