import { useState, useRef, useEffect } from 'react';
import { useArlo } from '@/providers/ArloProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, MicOff, Pin, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  pinned?: boolean;
  position?: { x: number; y: number };
}

interface SpatialChatInterfaceProps {
  onWidgetRequest: (type: 'weather' | 'map' | 'health', data?: any) => void;
}

export function SpatialChatInterface({ onWidgetRequest }: SpatialChatInterfaceProps) {
  const { messages, sendMessage, sendVoiceMessage, isLoading } = useArlo();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [floatingMessages, setFloatingMessages] = useState<ChatMessage[]>([]);
  const [draggedMessage, setDraggedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convert Arlo messages to spatial messages
  useEffect(() => {
    const spatialMessages = messages.map((msg, index) => ({
      id: msg.id,
      content: msg.content,
      role: msg.role,
      timestamp: new Date(),
      position: {
        x: window.innerWidth - 400 - (index % 3) * 120,
        y: 150 + (index * 80),
      },
    })) as ChatMessage[];
    
    setFloatingMessages(spatialMessages.slice(-8)); // Show last 8 messages
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

  const pinMessage = (messageId: string) => {
    setFloatingMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
    ));
  };

  const removeMessage = (messageId: string) => {
    setFloatingMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleMessageDragStart = (messageId: string, e: React.MouseEvent) => {
    setDraggedMessage(messageId);
    e.stopPropagation();
  };

  const handleMessageDrag = (messageId: string, e: React.MouseEvent) => {
    if (draggedMessage === messageId) {
      const newPosition = { x: e.clientX - 100, y: e.clientY - 50 };
      setFloatingMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, position: newPosition } : msg
      ));
    }
  };

  return (
    <>
      {/* Floating Chat Messages */}
      {floatingMessages.map((message) => (
        <div
          key={message.id}
          className={`
            fixed z-30 glass rounded-2xl p-3 max-w-xs shadow-lg
            transition-all duration-300 ease-out cursor-move
            chat-bubble-rise hover:scale-105
            ${message.pinned ? 'ring-2 ring-primary/50' : ''}
            ${draggedMessage === message.id ? 'scale-110 shadow-glow' : ''}
          `}
          style={{
            left: message.position?.x || 0,
            top: message.position?.y || 0,
          }}
          onMouseDown={(e) => handleMessageDragStart(message.id, e)}
          onMouseMove={(e) => handleMessageDrag(message.id, e)}
          onMouseUp={() => setDraggedMessage(null)}
        >
          {/* Message Header */}
          <div className="flex justify-between items-start mb-2">
            <span className={`
              text-xs font-medium
              ${message.role === 'user' ? 'text-primary' : 'text-accent'}
            `}>
              {message.role === 'user' ? 'You' : 'Arlo'}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => pinMessage(message.id)}
                className="h-4 w-4 p-0 hover:bg-primary/20"
              >
                <Pin className={`h-2 w-2 ${message.pinned ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMessage(message.id)}
                className="h-4 w-4 p-0 hover:bg-destructive/20"
              >
                <X className="h-2 w-2" />
              </Button>
            </div>
          </div>
          
          {/* Message Content */}
          <p className="text-sm text-foreground leading-relaxed">
            {message.content}
          </p>
        </div>
      ))}

      {/* Main Chat Input */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass rounded-full p-4 flex items-center gap-4 min-w-[500px] shadow-glow">
          {/* Text Input */}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Talk to Arlo..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />

          {/* Voice Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`
              rounded-full p-2 transition-all duration-200
              ${isRecording 
                ? 'bg-destructive text-destructive-foreground animate-pulse' 
                : 'hover:bg-primary/20 hover:text-primary'
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
            className="rounded-full p-2 bg-primary hover:bg-primary/80 text-primary-foreground"
            size="sm"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground glass px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Arlo is thinking...
            </div>
          </div>
        )}
      </div>
    </>
  );
}