import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Check for OAuth errors
        if (errorParam) {
          throw new Error(errorDescription || `Authentication failed: ${errorParam}`);
        }

        // Validate required parameters
        if (!code) {
          throw new Error('Authorization code not received');
        }

        if (!state) {
          throw new Error('State parameter missing');
        }

        // Exchange code for tokens
        setStatus('processing');
        const user = await authService.handleCallback(code, state);
        
        // Refresh auth context
        await refreshSession();
        
        setStatus('success');
        
        // Redirect to home page after short delay
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);

      } catch (error) {
        console.error('Authentication callback failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
        setError(errorMessage);
        setStatus('error');
        
        // Redirect to login after delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshSession]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <>
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/30 mb-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Authenticating...
            </h1>
            <p className="text-muted-foreground">
              Securely signing you in with Tailscale
            </p>
          </>
        );

      case 'success':
        return (
          <>
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-green-500/30 mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to Arlo!
            </h1>
            <p className="text-muted-foreground">
              Authentication successful. Redirecting...
            </p>
          </>
        );

      case 'error':
        return (
          <>
            <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-destructive/30 mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Authentication Failed
            </h1>
            <p className="text-muted-foreground mb-4">
              {error || 'An error occurred during authentication'}
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login page...
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      
      {/* Status Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-8 shadow-2xl text-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;