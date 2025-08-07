import { useState, useRef, useEffect, ReactNode } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface CoreProps {
  id: string;
  title: string;
  children: ReactNode;
  initialPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onClose?: () => void;
  className?: string;
}

const GRID_SIZE = 40;

export function Core({ 
  id, 
  title,
  children, 
  initialPosition, 
  onPositionChange, 
  onClose,
  className = '' 
}: CoreProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const coreRef = useRef<HTMLDivElement>(null);

  // Snap to grid
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

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center">
        <div className="w-[90vw] h-[90vh] glass rounded-3xl p-6 relative animate-scale-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="hover:bg-secondary/50"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="hover:bg-destructive/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="h-[calc(100%-4rem)] overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={coreRef}
      className={`
        fixed z-40 glass rounded-2xl shadow-2xl transition-all duration-300 ease-out
        ${isDragging ? 'scale-105 cursor-grabbing shadow-glow' : 'cursor-grab'}
        ${isHovered ? 'core-hover' : 'core-idle'}
        ${isExpanded ? 'animate-fade-in' : ''}
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
        userSelect: 'none',
        width: isExpanded ? 'auto' : '200px',
        minWidth: '200px',
        maxWidth: '400px',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 hover:bg-secondary/50"
          >
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="h-6 w-6 p-0 hover:bg-secondary/50"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-destructive/20"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4 select-none">
          {children}
        </div>
      )}
    </motion.div>
  );
}

