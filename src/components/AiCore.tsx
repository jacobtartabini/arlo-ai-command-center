import { useEffect, useState } from 'react';
import { useArlo } from '@/providers/ArloProvider';

export function AiCore() {
  const { isLoading, isConnected } = useArlo();
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [neuralActivity, setNeuralActivity] = useState(0);

  useEffect(() => {
    // Create a dynamic pulse effect based on activity
    const interval = setInterval(() => {
      setPulseIntensity(prev => prev === 1 ? 1.2 : 1);
      setNeuralActivity(prev => (prev + 1) % 360);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const coreState = isLoading ? 'thinking' : isConnected ? 'active' : 'inactive';

  return (
    <div className="relative animate-float">
      {/* Outer Neural Network */}
      <div className="absolute -inset-12 opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-ai-core-primary rounded-full animate-neural-pulse"
            style={{
              left: `${50 + 40 * Math.cos((neuralActivity + i * 60) * Math.PI / 180)}%`,
              top: `${50 + 40 * Math.sin((neuralActivity + i * 60) * Math.PI / 180)}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
        {/* Neural connections */}
        <svg className="absolute inset-0 w-full h-full animate-pulse">
          {[...Array(3)].map((_, i) => (
            <circle
              key={i}
              cx="50%"
              cy="50%"
              r={`${20 + i * 15}%`}
              fill="none"
              stroke="hsl(var(--ai-core-primary))"
              strokeWidth="1"
              opacity={0.2 - i * 0.05}
              strokeDasharray="5,5"
              className="animate-spin"
              style={{ animationDuration: `${10 + i * 5}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Main AI Core Sphere */}
      <div 
        className={`
          w-40 h-40 rounded-full relative overflow-hidden shadow-2xl
          ${coreState === 'thinking' ? 'animate-ai-thinking' : ''}
          ${coreState === 'active' ? 'animate-neural-pulse' : ''}
          transition-all duration-1000 ease-in-out
        `}
        style={{
          background: `
            radial-gradient(circle at 30% 30%, 
              hsl(var(--ai-core-glow)) 0%,
              hsl(var(--ai-core-secondary)) 20%,
              hsl(var(--ai-core-primary)) 60%,
              hsl(var(--background)) 100%
            )
          `,
          boxShadow: `
            0 0 60px hsl(var(--ai-core-primary) / 0.4),
            inset 0 0 60px hsl(var(--ai-core-glow) / 0.2)
          `,
          transform: `scale(${pulseIntensity})`,
        }}
      >
        {/* Outer energy field */}
        <div 
          className="absolute -inset-4 rounded-full opacity-40"
          style={{
            background: `radial-gradient(circle, hsl(var(--ai-core-primary) / 0.3) 0%, transparent 70%)`,
            animation: `neural-pulse 4s ease-in-out infinite`,
          }}
        />
        
        {/* Inner energy rings with dynamic movement */}
        <div className="absolute inset-3 rounded-full border border-white/30 animate-spin" style={{ animationDuration: '25s' }} />
        <div className="absolute inset-6 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
        <div className="absolute inset-9 rounded-full border border-white/10 animate-spin" style={{ animationDuration: '15s' }} />
        
        {/* Core consciousness center */}
        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm" />
        <div className="absolute inset-14 rounded-full bg-gradient-to-br from-white/70 to-white/30" />
        
        {/* Activity indicators */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full animate-ping" />
            <div className="absolute w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Consciousness ripples */}
        {isConnected && (
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border border-white/10 animate-ping"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s',
                }}
              />
            ))}
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