import { useEffect, useState } from 'react';
import { useArlo } from '@/providers/ArloProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Cpu, HardDrive, RefreshCw, Zap } from 'lucide-react';

export function SystemHealthWidget() {
  const { status, refreshStatus } = useArlo();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStatus();
    setIsRefreshing(false);
  };

  const getHealthStatus = () => {
    if (!status) return { color: 'destructive', text: 'Unknown' };
    
    const avgUsage = (status.memory + status.cpu) / 2;
    if (avgUsage < 50) return { color: 'default', text: 'Healthy' };
    if (avgUsage < 80) return { color: 'secondary', text: 'Moderate' };
    return { color: 'destructive', text: 'High Load' };
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const healthStatus = getHealthStatus();

  return (
    <Card className="w-80 glass border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status ? (
          <>
            {/* Overall health status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Status</span>
              <Badge variant={healthStatus.color as any}>
                {healthStatus.text}
              </Badge>
            </div>

            {/* Uptime */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm">Uptime</span>
              </div>
              <span className="font-semibold">{formatUptime(status.uptime)}</span>
            </div>

            {/* CPU Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">CPU Usage</span>
                </div>
                <span className="text-sm font-medium">{status.cpu}%</span>
              </div>
              <Progress value={status.cpu} className="h-2" />
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Memory Usage</span>
                </div>
                <span className="text-sm font-medium">{status.memory}%</span>
              </div>
              <Progress value={status.memory} className="h-2" />
            </div>

            {/* Active modules */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Active Modules ({status.modules.length})</span>
              <div className="flex flex-wrap gap-1">
                {status.modules.slice(0, 4).map((module) => (
                  <Badge key={module} variant="outline" className="text-xs">
                    {module}
                  </Badge>
                ))}
                {status.modules.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{status.modules.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No system data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}