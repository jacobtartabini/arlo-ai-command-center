import { useState, useRef, useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableWidgetProps {
  id: string;
  children: ReactNode;
  initialPosition: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onClose?: () => void;
  className?: string;
}

export function DraggableWidget({ 
  id, 
  children, 
  initialPosition, 
  onPositionChange, 
  onClose,
  className = '' 
}: DraggableWidgetProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      
      // Keep widget within viewport bounds
      const rect = widgetRef.current?.getBoundingClientRect();
      if (rect) {
        newPosition.x = Math.max(0, Math.min(window.innerWidth - rect.width, newPosition.x));
        newPosition.y = Math.max(0, Math.min(window.innerHeight - rect.height, newPosition.y));
      }
      
      setPosition(newPosition);
      onPositionChange(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('button')) {
      return; // Don't drag when clicking buttons
    }
    
    const rect = widgetRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  return (
    <div
      ref={widgetRef}
      className={`
        fixed z-50 glass rounded-2xl p-4 shadow-2xl
        animate-fade-in transition-all duration-200
        ${isDragging ? 'scale-105 cursor-grabbing' : 'cursor-grab hover:scale-[1.02]'}
        ${className}
      `}
      style={{
        left: position.x,
        top: position.y,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/20"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      {/* Content */}
      <div className="select-none">
        {children}
      </div>
    </div>
  );
}
