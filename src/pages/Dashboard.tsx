import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useArlo } from '@/providers/ArloProvider';
import { AiCore } from '@/components/AiCore';
import { ChatInterface } from '@/components/ChatInterface';
import { DraggableWidget } from '@/components/DraggableWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { MapWidget } from '@/components/widgets/MapWidget';
import { SystemHealthWidget } from '@/components/widgets/SystemHealthWidget';
import { Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, logout, tailscaleVerified } = useAuth();
  const { isConnected, checkConnection } = useArlo();
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<Array<{
    id: string;
    type: 'weather' | 'map' | 'health';
    position: { x: number; y: number };
    data?: any;
  }>>([]);

  useEffect(() => {
    const verifyConnection = async () => {
      // If user is authenticated via Tailscale, don't check Arlo connection
      // as the verification endpoint and Arlo endpoint might be different
      if (tailscaleVerified) {
        return;
      }
      
      const connected = await checkConnection();
      if (!connected) {
        navigate('/unauthorized');
      }
    };

    verifyConnection();
  }, [checkConnection, navigate, tailscaleVerified]);

  const addWidget = (type: 'weather' | 'map' | 'health', data?: any) => {
    const newWidget = {
      id: Date.now().toString(),
      type,
      position: { 
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 200)
      },
      data,
    };
    setWidgets(prev => [...prev, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id));
  };

  const updateWidgetPosition = (id: string, position: { x: number; y: number }) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, position } : widget
    ));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Only show connection check for non-Tailscale users
  if (!tailscaleVerified && !isConnected) {
    return null; // Will redirect to unauthorized
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Arlo
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-card/20 backdrop-blur-sm border border-border/50">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {user?.name || user?.email || (tailscaleVerified ? 'Tailscale User' : 'Guest')}
              </span>
            </div>
            
            {/* Settings */}
            <a
              href="/settings"
              className="p-2 rounded-lg bg-card/20 backdrop-blur-sm border border-border/50 hover:bg-card/30 transition-all duration-300 text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-5 h-5" />
            </a>
            
            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg bg-card/20 backdrop-blur-sm border border-border/50 hover:bg-destructive/20 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      
      {/* AI Core */}
      <DraggableWidget
        id="ai-core"
        initialPosition={{ x: window.innerWidth / 2 - 100, y: 100 }}
        onPositionChange={() => {}}
      >
        <AiCore />
      </DraggableWidget>

      {/* Dynamic Widgets */}
      {widgets.map((widget) => (
        <DraggableWidget
          key={widget.id}
          id={widget.id}
          initialPosition={widget.position}
          onPositionChange={(position) => updateWidgetPosition(widget.id, position)}
          onClose={() => removeWidget(widget.id)}
        >
          {widget.type === 'weather' && <WeatherWidget location={widget.data?.location} />}
          {widget.type === 'map' && <MapWidget start={widget.data?.start} end={widget.data?.end} />}
          {widget.type === 'health' && <SystemHealthWidget />}
        </DraggableWidget>
      ))}

      {/* Chat Interface */}
      <ChatInterface onWidgetRequest={addWidget} />
    </div>
  );
}