import { useState, useRef, useEffect } from 'react';
import { useArlo } from '@/providers/ArloProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SpatialChatInterfaceProps {
  onWidgetRequest: (type: 'weather' | 'map' | 'health', data?: any) => void;
}

interface FloatingMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  position: { x: number; y: number };
  timestamp: number;
}

export function SpatialChatInterface({ onWidgetRequest }: SpatialChatInterfaceProps) {
  const { messages, sendMessage, sendVoiceMessage, isLoading } = useArlo();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([]);
  const [showAllMessages, setShowAllMessages] = useState(false);

  // Convert new messages to floating messages
  useEffect(() => {
    const newFloatingMessages = messages.slice(-3).map((message, index) => ({
      id: message.id,
      content: message.content,
      role: message.role,
      position: {
        x: window.innerWidth - 400 + (index * 20),
        y: window.innerHeight - 200 - (index * 80),
      },
      timestamp: Date.now(),
    }));
    
    setFloatingMessages(newFloatingMessages);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    
    // Check for widget triggers
    if (message.toLowerCase().includes('weather')) {
      const locationMatch = message.match(/weather\s+(?:in|for|at)\s+([a-zA-Z\s]+)/i);
      const location = locationMatch ? locationMatch[1].trim() : 'current location';
      onWidgetRequest('weather', { location });
    } else if (message.toLowerCase().includes('map') || message.toLowerCase().includes('directions')) {
      onWidgetRequest('map');
    } else if (message.toLowerCase().includes('system') || message.toLowerCase().includes('health')) {
      onWidgetRequest('health');
    }
    
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* Floating Chat Messages */}
      {floatingMessages.map((message, index) => (
        <div
          key={message.id}
          className={`
            fixed z-40 max-w-xs p-4 rounded-2xl backdrop-blur-xl border animate-chat-bubble-rise
            ${message.role === 'user' 
              ? 'bg-primary/20 border-primary/30 text-primary-foreground' 
              : 'bg-secondary/20 border-secondary/30 text-secondary-foreground'
            }
          `}
          style={{
            left: message.position.x,
            top: message.position.y,
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <div className="text-sm font-medium mb-1">
            {message.role === 'user' ? 'You' : 'Arlo'}
          </div>
          <div className="text-sm opacity-90">
            {message.content}
          </div>
          
          {/* Floating animation effect */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse" />
        </div>
      ))}

      {/* All Messages Overlay */}
      {showAllMessages && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-2xl flex items-center justify-center">
          <div className="w-[90vw] max-w-4xl h-[80vh] glass-intense rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Conversation History</h2>
              <Button
                variant="ghost"
                onClick={() => setShowAllMessages(false)}
                className="hover:bg-white/10"
              >
                Close
              </Button>
            </div>
            
            <div className="h-[calc(100%-4rem)] overflow-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`
                    flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                  `}
                >
                  <div
                    className={`
                      max-w-2xl p-4 rounded-2xl backdrop-blur-sm
                      ${message.role === 'user' 
                        ? 'bg-primary/30 text-primary-foreground border border-primary/50' 
                        : 'bg-secondary/30 text-secondary-foreground border border-secondary/50'
                      }
                    `}
                  >
                    <div className="text-xs opacity-70 mb-1">
                      {message.role === 'user' ? 'You' : 'Arlo'}
                    </div>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Input - Bottom Center */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="backdrop-blur-2xl bg-card/20 border border-white/10 rounded-full p-4 flex items-center gap-4 min-w-[500px] shadow-2xl">
          {/* Message History Button */}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-10 w-10 p-0 hover:bg-white/10"
              onClick={() => setShowAllMessages(!showAllMessages)}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          )}

          {/* Text Input */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Speak with Arlo..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground text-lg"
            disabled={isLoading}
          />

          {/* Voice Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`
              rounded-full h-10 w-10 p-0 transition-all duration-300
              ${isRecording 
                ? 'bg-red-500/30 text-red-300 shadow-lg shadow-red-500/20' 
                : 'hover:bg-white/10'
              }
            `}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            disabled={isLoading}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-full h-10 w-10 p-0 bg-primary/30 hover:bg-primary/50 border border-primary/50"
            size="sm"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-3 text-sm text-muted-foreground backdrop-blur-xl bg-card/20 px-6 py-3 rounded-full border border-white/10">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Arlo is processing...
            </div>
          </div>
        )}
      </div>
    </>
  );
}