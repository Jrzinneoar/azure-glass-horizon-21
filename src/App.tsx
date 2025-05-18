
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/AuthCallback";
import AuthLayout from "@/layouts/AuthLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route path="/dashboard" element={
              <AuthLayout>
                <Dashboard />
              </AuthLayout>
            } />
            
            <Route path="/users" element={
              <AuthLayout requiredRole="admin">
                <Users />
              </AuthLayout>
            } />
            
            <Route path="/profile" element={
              <AuthLayout>
                <Profile />
              </AuthLayout>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
