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
import { Settings, LogOut, User, Menu } from 'lucide-react';
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
        x: Math.random() * (window.innerWidth - 300),
        y: Math.random() * (window.innerHeight - 200)
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
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
      {/* Ambient Background Effects */}
      <div className="absolute inset-0">
        {/* Deep space gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-ai-core-primary/5 via-transparent to-accent/5" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-ai-core-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Minimal Navigation - Only visible on hover */}
      <div 
        className={`
          fixed top-6 right-6 z-50 transition-all duration-500 ease-in-out
          ${showNavigation ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-2'}
        `}
        onMouseEnter={() => setShowNavigation(true)}
        onMouseLeave={() => setShowNavigation(false)}
      >
        <div className="backdrop-blur-2xl bg-card/20 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          {showNavigation && (
            <>
              {/* User Info */}
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-card/30 backdrop-blur-sm border border-white/10">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {user?.name || user?.email || (tailscaleVerified ? 'Tailscale User' : 'Guest')}
                </span>
              </div>
              
              {/* Settings */}
              <a
                href="/settings"
                className="p-2 rounded-lg bg-card/30 backdrop-blur-sm border border-white/10 hover:bg-card/50 transition-all duration-300 text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-5 h-5" />
              </a>
              
              {/* Logout */}
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg bg-card/30 backdrop-blur-sm border border-white/10 hover:bg-destructive/20 hover:text-destructive transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          )}
          
          {!showNavigation && (
            <Button variant="ghost" size="sm" className="p-2">
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Central Arlo Core */}
      <Core
        id="arlo-core"
        title="ARLO"
        type="ai"
        initialPosition={{ x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 150 }}
        onPositionChange={() => {}}
      >
        <AiCore />
      </Core>

      {/* Dynamic Cores */}
      {cores.map((core) => (
        <Core
          key={core.id}
          id={core.id}
          title={
            core.type === 'weather' ? 'Weather Core' :
            core.type === 'map' ? 'Navigation Core' :
            core.type === 'health' ? 'System Core' :
            'Unknown Core'
          }
          type={core.type}
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