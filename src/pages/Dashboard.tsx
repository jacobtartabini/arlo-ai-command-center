import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useArlo } from '@/providers/ArloProvider';
import { AiCore } from '@/components/AiCore';
import { SpatialChatInterface } from '@/components/SpatialChatInterface';
import { Core } from '@/components/Core';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { MapWidget } from '@/components/widgets/MapWidget';
import { SystemHealthWidget } from '@/components/widgets/SystemHealthWidget';
import { Settings, LogOut, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, logout, tailscaleVerified } = useAuth();
  const { isConnected, checkConnection } = useArlo();
  const navigate = useNavigate();
  const [cores, setCores] = useState<Array<{
    id: string;
    type: 'weather' | 'map' | 'health';
    position: { x: number; y: number };
    data?: any;
  }>>([]);
  const [showNavigation, setShowNavigation] = useState(false);

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

  const addCore = (type: 'weather' | 'map' | 'health', data?: any) => {
    const newCore = {
      id: Date.now().toString(),
      type,
      position: { 
        x: 200 + Math.random() * (window.innerWidth - 600),
        y: 200 + Math.random() * (window.innerHeight - 400)
      },
      data,
    };
    setCores(prev => [...prev, newCore]);
  };

  const removeCore = (id: string) => {
    setCores(prev => prev.filter(core => core.id !== id));
  };

  const updateCorePosition = (id: string, position: { x: number; y: number }) => {
    setCores(prev => prev.map(core => 
      core.id === id ? { ...core, position } : core
    ));
  };

  const getCoreTitle = (type: string) => {
    switch (type) {
      case 'weather': return 'Weather Core';
      case 'map': return 'Map Core';
      case 'health': return 'Health Core';
      default: return 'Core';
    }
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
    <div 
      className="min-h-screen relative overflow-hidden spatial-grid"
      style={{ background: '#0D1117' }}
    >
      {/* Floating Navigation - Hidden by default, shows on hover */}
      <nav 
        className={`
          fixed top-6 left-1/2 transform -translate-x-1/2 z-50 
          glass rounded-full px-6 py-3 transition-all duration-300
          ${showNavigation ? 'opacity-100 translate-y-0' : 'opacity-30 -translate-y-2'}
        `}
        onMouseEnter={() => setShowNavigation(true)}
        onMouseLeave={() => setShowNavigation(false)}
      >
        <div className="flex items-center gap-6">
          {/* Logo */}
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Arlo
          </h1>
          
          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {/* Add Core Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addCore('weather')}
              className="rounded-full hover:bg-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Core
            </Button>
            
            {/* User Info */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card/20">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-foreground">
                {user?.name || user?.email || (tailscaleVerified ? 'Tailscale User' : 'Guest')}
              </span>
            </div>
            
            {/* Settings */}
            <a
              href="/settings"
              className="p-2 rounded-full hover:bg-secondary/50 transition-all duration-200"
            >
              <Settings className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </a>
            
            {/* Logout */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="p-2 rounded-full hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Central Arlo Avatar */}
      <div 
        className="fixed z-30"
        style={{
          left: window.innerWidth / 2 - 64,
          top: window.innerHeight / 2 - 100,
        }}
      >
        <AiCore />
      </div>

      {/* Dynamic Cores */}
      {cores.map((core) => (
        <Core
          key={core.id}
          id={core.id}
          title={getCoreTitle(core.type)}
          initialPosition={core.position}
          onPositionChange={(position) => updateCorePosition(core.id, position)}
          onClose={() => removeCore(core.id)}
        >
          {core.type === 'weather' && <WeatherWidget location={core.data?.location} />}
          {core.type === 'map' && <MapWidget start={core.data?.start} end={core.data?.end} />}
          {core.type === 'health' && <SystemHealthWidget />}
        </Core>
      ))}

      {/* Spatial Chat Interface */}
      <SpatialChatInterface onWidgetRequest={addCore} />
    </div>
  );
}