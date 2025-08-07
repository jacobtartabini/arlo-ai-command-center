import React, { useEffect } from 'react';
import { useArlo } from '@/providers/ArloProvider';
import EnhancedThemeToggle from '@/components/EnhancedThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bot, 
  Shield, 
  Server, 
  Bell,
  Globe,
  Database,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { config, setConfig, status, isConnected } = useArlo();

  // SEO
  useEffect(() => {
    document.title = "Arlo AI Settings — Configure Your Assistant";
    const desc = "Configure Arlo AI settings including appearance, privacy, notifications, and system preferences.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    if (meta) meta.content = desc;

    if (!document.querySelector('link[rel="canonical"]')) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = window.location.href;
      document.head.appendChild(link);
    }
  }, []);

  const handleSaveConfig = () => {
    toast.success('Configuration saved successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative pt-20">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-full bg-background/60 backdrop-blur-md border border-border/30">
            <SettingsIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Customize your Arlo AI experience</p>
          </div>
          {isConnected && (
            <Badge className="ml-auto bg-green-500/10 text-green-500 border-green-500/20">
              Connected
            </Badge>
          )}
        </header>

        <main className="space-y-8">
          {/* Appearance Settings */}
          <section>
            <Card className="bg-background/40 backdrop-blur-md border border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the visual appearance and theme of the interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedThemeToggle />
              </CardContent>
            </Card>
          </section>

          {/* AI Assistant Settings */}
          <section>
            <Card className="bg-background/40 backdrop-blur-md border border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Assistant
                </CardTitle>
                <CardDescription>
                  Configure how Arlo AI behaves and responds to your queries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Voice Responses</Label>
                      <p className="text-xs text-muted-foreground">Enable audio responses from Arlo</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Auto Suggestions</Label>
                      <p className="text-xs text-muted-foreground">Show contextual suggestions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Smart Completion</Label>
                      <p className="text-xs text-muted-foreground">Auto-complete commands and queries</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Learning Mode</Label>
                      <p className="text-xs text-muted-foreground">Allow Arlo to learn from interactions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Connection & API Settings */}
          <section>
            <Card className="bg-background/40 backdrop-blur-md border border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Connection Settings
                </CardTitle>
                <CardDescription>
                  Configure your connection to the Arlo AI backend services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">API Endpoint</Label>
                    <Input
                      id="endpoint"
                      placeholder="http://100.64.0.1:8080"
                      value={config.apiEndpoint}
                      className="bg-background/60 backdrop-blur-md border-border/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="token">API Token</Label>
                    <Input
                      id="token"
                      type="password"
                      placeholder="Enter your API token"
                      value={config.apiToken}
                      className="bg-background/60 backdrop-blur-md border-border/30"
                    />
                  </div>
                </div>
                
                {status && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/20 border border-border/20">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      System Status
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{Math.floor(status.uptime / 3600)}h</div>
                        <div className="text-muted-foreground">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{status.memory}%</div>
                        <div className="text-muted-foreground">Memory</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{status.cpu}%</div>
                        <div className="text-muted-foreground">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{status.modules.length}</div>
                        <div className="text-muted-foreground">Modules</div>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleSaveConfig} className="w-full">
                  Save Connection Settings
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Privacy & Security */}
          <section>
            <Card className="bg-background/40 backdrop-blur-md border border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Control your data privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Data Collection</Label>
                      <p className="text-xs text-muted-foreground">Allow usage data collection</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Analytics</Label>
                      <p className="text-xs text-muted-foreground">Help improve Arlo with analytics</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Chat History</Label>
                      <p className="text-xs text-muted-foreground">Store conversation history</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">End-to-End Encryption</Label>
                      <p className="text-xs text-muted-foreground">Encrypt all communications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Notifications */}
          <section>
            <Card className="bg-background/40 backdrop-blur-md border border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive email updates</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">System Alerts</Label>
                      <p className="text-xs text-muted-foreground">Critical system notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/20">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Update Notifications</Label>
                      <p className="text-xs text-muted-foreground">Notify about updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}