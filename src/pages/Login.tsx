import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { Shield } from 'lucide-react';
import { useRouter } from 'next/router'; // <-- Added for routing

const Login: React.FC = () => {
  const router = useRouter(); // <-- Needed for redirection
  const { login, isLoading, error, setError } = useAuth();
  const [accessVerified, setAccessVerified] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const verifyUrl = "https://jacobs-macbook-pro.tailf531bd.ts.net/api/verify";

        const response = await fetch(verifyUrl, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          console.warn('Verification failed:', data);
          setError(data.error || 'Access denied. Please connect to Tailscale.');
          setAccessVerified(false);
        } else {
          const data = await response.json().catch(() => ({}));
          console.log('Access verified:', data);
          setError(null);
          setAccessVerified(true);
        }
      } catch (err) {
        console.error('Network verification failed:', err);
        setError('Failed to verify access. Check network connection.');
        setAccessVerified(false);
      }
    };

    verifyAccess();
  }, [setError]);

  // 🔁 Redirect after successful verification
  useEffect(() => {
    if (accessVerified) {
      router.push('/dashboard');
    }
  }, [accessVerified, router]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-8 shadow-2xl">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/30">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome to Arlo
            </h1>
            <p className="text-muted-foreground text-lg">
              Sign in securely with Tailscale
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={isLoading || !accessVerified}
            className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Signing in...
              </div>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Sign in with Tailscale
              </>
            )}
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Secure authentication powered by Zitadel OIDC
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Protected by enterprise-grade security
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
