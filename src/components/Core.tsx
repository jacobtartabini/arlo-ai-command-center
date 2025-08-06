import { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoreProps {
  id: string;
  title: string;
  type: 'weather' | 'map' | 'health' | 'ai' | 'chat';
  children: ReactNode;
  initialPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onClose?: () => void;
  className?: string;
}

const GRID_SIZE = 20; // Grid snap size

export function Core({ 
  id, 
  title,
  type,
  children, 
  initialPosition, 
  onPositionChange, 
  onClose,
  className = '' 
}: CoreProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const coreRef = useRef<HTMLDivElement>(null);

  // Snap to grid function
  const snapToGrid = (pos: { x: number; y: number }) => ({
    x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      
      // Keep core within viewport bounds
      const rect = coreRef.current?.getBoundingClientRect();
      if (rect) {
        newPosition.x = Math.max(0, Math.min(window.innerWidth - rect.width, newPosition.x));
        newPosition.y = Math.max(0, Math.min(window.innerHeight - rect.height, newPosition.y));
      }
      
      setPosition(newPosition);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        // Snap to grid on release
        const snappedPosition = snapToGrid(position);
        setPosition(snappedPosition);
        onPositionChange(snappedPosition);
        setIsDragging(false);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('button')) {
      return; // Don't drag when clicking buttons
    }
    
    const rect = coreRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const getCoreTypeStyles = () => {
    const baseStyles = "backdrop-blur-xl border border-white/10 shadow-2xl";
    
    switch (type) {
      case 'ai':
        return `${baseStyles} bg-gradient-to-br from-ai-core-primary/20 to-ai-core-secondary/20 shadow-ai-core-primary/20`;
      case 'weather':
        return `${baseStyles} bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-blue-500/20`;
      case 'map':
        return `${baseStyles} bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-green-500/20`;
      case 'health':
        return `${baseStyles} bg-gradient-to-br from-red-500/20 to-pink-500/20 shadow-red-500/20`;
      case 'chat':
        return `${baseStyles} bg-gradient-to-br from-purple-500/20 to-indigo-500/20 shadow-purple-500/20`;
      default:
        return `${baseStyles} bg-gradient-to-br from-primary/20 to-accent/20 shadow-primary/20`;
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-2xl flex items-center justify-center">
        <div className="w-[90vw] h-[90vh] glass-intense rounded-3xl p-8 relative animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-white/10"
                onClick={() => setIsFullscreen(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-destructive/20"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="h-[calc(100%-4rem)] overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={coreRef}
      className={`
        fixed z-50 rounded-2xl transition-all duration-300 animate-core-float
        ${getCoreTypeStyles()}
        ${isDragging ? 'scale-105 cursor-grabbing shadow-3xl' : 'cursor-grab hover:scale-[1.02]'}
        ${isMinimized ? 'w-16 h-16' : 'p-6'}
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Core Header */}
      <div className="flex justify-between items-center mb-4">
        {!isMinimized && (
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
        )}
        
        <div className="flex gap-2 ml-auto">
          {/* Minimize/Maximize button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/10"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          
          {/* Fullscreen button */}
          {!isMinimized && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-white/10"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          )}
          
          {/* Close button */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-destructive/20"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Core Content */}
      {!isMinimized && (
        <div className="select-none">
          {children}
        </div>
      )}
      
      {/* Minimized state indicator */}
      {isMinimized && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full animate-neural-pulse ${
            type === 'ai' ? 'bg-ai-core-primary' :
            type === 'weather' ? 'bg-blue-500' :
            type === 'map' ? 'bg-green-500' :
            type === 'health' ? 'bg-red-500' :
            type === 'chat' ? 'bg-purple-500' :
            'bg-primary'
          }`} />
        </div>
      )}
    </div>
  );
}
