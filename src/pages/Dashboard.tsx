import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArlo } from '@/providers/ArloProvider';
import { AiCore } from '@/components/AiCore';
import { ChatInterface } from '@/components/ChatInterface';
import { DraggableWidget } from '@/components/DraggableWidget';
import { WeatherWidget } from '@/components/widgets/WeatherWidget';
import { MapWidget } from '@/components/widgets/MapWidget';
import { SystemHealthWidget } from '@/components/widgets/SystemHealthWidget';

export default function Dashboard() {
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
      const connected = await checkConnection();
      if (!connected) {
        navigate('/unauthorized');
      }
    };

    verifyConnection();
  }, [checkConnection, navigate]);

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

  if (!isConnected) {
    return null; // Will redirect to unauthorized
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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