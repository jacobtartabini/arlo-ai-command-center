import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArlo } from '@/providers/ArloProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX, Wifi, RefreshCw, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { config, setConfig, checkConnection } = useArlo();
  const [isRetrying, setIsRetrying] = useState(false);
  const [tempToken, setTempToken] = useState(config.apiToken);

  const handleRetry = async () => {
    setIsRetrying(true);
    const connected = await checkConnection();
    if (connected) {
      navigate('/dashboard');
      toast.success('Successfully connected to Arlo!');
    } else {
      toast.error('Still unable to connect to Arlo');
    }
    setIsRetrying(false);
  };

  const handleTokenUpdate = () => {
    setConfig({ ...config, apiToken: tempToken });
    toast.success('Token updated');
    handleRetry();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Warning Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full glass flex items-center justify-center mb-4">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Access Restricted</h1>
          <p className="text-muted-foreground">
            Unable to connect to Arlo AI Assistant
          </p>
        </div>

        {/* Connection Status */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Wifi className="h-5 w-5" />
              Connection Failed
            </CardTitle>
            <CardDescription>
              The frontend cannot reach the Arlo backend API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Make sure you are connected to the correct Tailscale network and that 
                the Arlo backend is running at: <code className="text-primary">{config.apiEndpoint}</code>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-medium">Possible causes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Not connected to the Tailscale network</li>
                <li>• Arlo backend is offline or unreachable</li>
                <li>• Incorrect API endpoint configuration</li>
                <li>• Invalid authentication token</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Token Update */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Update Token
            </CardTitle>
            <CardDescription>
              Try connecting with a different bearer token
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Bearer Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="Enter your API token"
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
              />
            </div>
            <Button onClick={handleTokenUpdate} className="w-full">
              Update & Retry
            </Button>
          </CardContent>
        </Card>

        {/* Retry Button */}
        <Button
          onClick={handleRetry}
          disabled={isRetrying}
          variant="outline"
          className="w-full glass"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Checking connection...' : 'Retry Connection'}
        </Button>

        {/* Settings Link */}
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => navigate('/settings')}
            className="text-muted-foreground"
          >
            Go to Settings
          </Button>
        </div>
      </div>
    </div>
  );
}