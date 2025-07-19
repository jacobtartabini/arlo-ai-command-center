import { useState } from 'react';
import { useArlo } from '@/providers/ArloProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Power, Settings as SettingsIcon, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { config, setConfig, status, isConnected, refreshStatus, restartArlo } = useArlo();
  const { theme, setTheme } = useTheme();
  const [tempConfig, setTempConfig] = useState(config);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const handleSaveConfig = () => {
    setConfig(tempConfig);
    toast.success('Configuration saved');
  };

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    await refreshStatus();
    setIsRefreshing(false);
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    await restartArlo();
    setIsRestarting(false);
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-full glass">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Arlo Settings</h1>
            <p className="text-muted-foreground">Configure your AI assistant</p>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              Connection Status
            </CardTitle>
            <CardDescription>
              Current connection state to Arlo backend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Configure the connection to your Arlo backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                placeholder="http://100.64.0.1:8080"
                value={tempConfig.apiEndpoint}
                onChange={(e) => setTempConfig(prev => ({ ...prev, apiEndpoint: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">API Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="Enter your API token"
                value={tempConfig.apiToken}
                onChange={(e) => setTempConfig(prev => ({ ...prev, apiToken: e.target.value }))}
              />
            </div>
            <Button onClick={handleSaveConfig} className="w-full">
              Save Configuration
            </Button>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        {status && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                System Status
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshStatus}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                Real-time system health and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Uptime</Label>
                  <p className="text-2xl font-bold text-primary">
                    {formatUptime(status.uptime)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Memory Usage</Label>
                  <p className="text-2xl font-bold text-primary">
                    {status.memory}%
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>CPU Usage</Label>
                  <p className="text-2xl font-bold text-primary">
                    {status.cpu}%
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Modules</Label>
                  <p className="text-2xl font-bold text-primary">
                    {status.modules.length}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Active Modules</Label>
                <div className="flex flex-wrap gap-2">
                  {status.modules.map((module) => (
                    <Badge key={module} variant="secondary">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Controls */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
            <CardDescription>
              Administrative functions for Arlo management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="destructive"
              onClick={handleRestart}
              disabled={isRestarting || !isConnected}
              className="w-full"
            >
              <Power className={`h-4 w-4 mr-2 ${isRestarting ? 'animate-spin' : ''}`} />
              {isRestarting ? 'Restarting...' : 'Restart Arlo'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}