import { useEffect, useState } from 'react';
import { useArlo } from '@/providers/ArloProvider';

export function AiCore() {
  const { isLoading, isConnected, messages } = useArlo();
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [neuralActivity, setNeuralActivity] = useState(0);

  useEffect(() => {
    // Create a dynamic pulse effect based on activity
    const interval = setInterval(() => {
      setPulseIntensity(prev => prev === 1 ? 1.1 : 1);
      setNeuralActivity(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // React to new messages
  useEffect(() => {
    if (messages.length > 0) {
      setNeuralActivity(4); // Intense activity
      const timer = setTimeout(() => setNeuralActivity(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const coreState = isLoading ? 'thinking' : isConnected ? 'active' : 'inactive';

  return (
    <div className="relative group">
      {/* Neural Network Background */}
      <div className="absolute inset-0 w-48 h-48 -translate-x-8 -translate-y-8 opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full neural-pulse"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + Math.sin(i) * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        {/* Neural connections */}
        <svg className="absolute inset-0 w-full h-full">
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={`${20 + (i * 15)}%`}
              y1={`${30 + Math.sin(i) * 20}%`}
              x2={`${35 + (i * 15)}%`}
              y2={`${30 + Math.sin(i + 1) * 20}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              opacity="0.2"
              className="neural-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Main AI Core Sphere */}
      <div 
        className={`
          w-32 h-32 rounded-full relative overflow-hidden
          ${coreState === 'thinking' ? 'ai-core-thinking' : ''}
          ${coreState === 'active' ? 'ai-core-pulse' : ''}
          transition-all duration-1000 ease-in-out
          hover:scale-110 cursor-pointer
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
        
        {/* Dynamic energy rings based on activity */}
        <div className="absolute inset-2 rounded-full border border-white/20 animate-spin" style={{ animationDuration: `${20 - neuralActivity * 2}s` }} />
        <div className="absolute inset-4 rounded-full border border-white/10 animate-spin" style={{ animationDuration: `${15 - neuralActivity}s`, animationDirection: 'reverse' }} />
        <div className="absolute inset-6 rounded-full border border-white/5 animate-spin" style={{ animationDuration: `${10 - neuralActivity}s` }} />
        
        {/* Core energy center */}
        <div className="absolute inset-8 rounded-full bg-white/30 backdrop-blur-sm" />
        <div className="absolute inset-10 rounded-full bg-white/50" />
        
        {/* Activity indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        )}

        {/* Ripple effect on activity */}
        {neuralActivity > 2 && (
          <div className="absolute inset-0 rounded-full border-2 border-white/40 animate-ping" />
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