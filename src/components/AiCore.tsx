import { useEffect, useState } from 'react';
import { useArlo } from '@/providers/ArloProvider';

export function AiCore() {
  const { isLoading, isConnected } = useArlo();
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useEffect(() => {
    // Create a dynamic pulse effect based on activity
    const interval = setInterval(() => {
      setPulseIntensity(prev => prev === 1 ? 1.2 : 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const coreState = isLoading ? 'thinking' : isConnected ? 'active' : 'inactive';

  return (
    <div className="relative">
      {/* Main AI Core Sphere */}
      <div 
        className={`
          w-32 h-32 rounded-full relative overflow-hidden
          ${coreState === 'thinking' ? 'ai-core-thinking' : ''}
          ${coreState === 'active' ? 'ai-core-pulse' : ''}
          transition-all duration-1000 ease-in-out
        `}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, 
              hsl(var(--ai-core-secondary)) 0%,
              hsl(var(--ai-core-primary)) 40%,
              hsl(var(--ai-core-primary)) 100%
            )
          `,
          transform: `scale(${pulseIntensity})`,
        }}
      >
        {/* Outer glow effect */}
        <div 
          className={`
            absolute inset-0 rounded-full
            ${isConnected ? 'ai-core-glow' : ''}
            transition-all duration-1000
          `} 
        />
        
        {/* Inner energy rings */}
        <div className="absolute inset-2 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute inset-4 rounded-full border border-white/10 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        <div className="absolute inset-6 rounded-full border border-white/5 animate-spin" style={{ animationDuration: '10s' }} />
        
        {/* Core energy center */}
        <div className="absolute inset-8 rounded-full bg-white/30 backdrop-blur-sm" />
        <div className="absolute inset-10 rounded-full bg-white/50" />
        
        {/* Activity indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        )}
      </div>
      
      {/* Status indicator */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className={`
          px-3 py-1 rounded-full text-xs font-medium glass
          ${isConnected ? 'text-green-400' : 'text-red-400'}
        `}>
          {coreState === 'thinking' ? 'Thinking...' : 
           coreState === 'active' ? 'Online' : 'Offline'}
        </div>
      </div>
      
      {/* Name label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <h2 className="text-lg font-bold text-primary">ARLO</h2>
        <p className="text-xs text-muted-foreground">AI Assistant</p>
      </div>
    </div>
  );
}