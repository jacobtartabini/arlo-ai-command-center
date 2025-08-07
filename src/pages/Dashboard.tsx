import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  MessageCircle,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  Globe,
  StickyNote,
  Map as MapIcon,
  Music,
  Camera,
  Send,
  Plus,
  Minus,
  X,
  Maximize2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/AuthProvider";
import { useArlo } from "@/providers/ArloProvider";
import { useNavigate } from "react-router-dom";

interface Core {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isCollapsed: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "arlo";
  timestamp: Date;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { tailscaleVerified } = useAuth();
  const { isConnected, checkConnection } = useArlo();

  // Tabs and UI state
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "chat" | "calendar" | "settings"
  >("dashboard");
  const [cores, setCores] = useState<Core[]>([
    {
      id: "web",
      title: "Web",
      icon: <Globe className="w-5 h-5" />,
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Web Search</h3>
          <p className="text-sm text-muted-foreground">Browse and search the web</p>
          <div className="mt-4 space-y-2">
            <div className="p-2 bg-muted/50 rounded text-xs">Recent: AI News</div>
            <div className="p-2 bg-muted/50 rounded text-xs">Recent: Weather</div>
          </div>
        </div>
      ),
      position: { x: 50, y: 50 },
      size: { width: 280, height: 200 },
      isCollapsed: false,
    },
    {
      id: "notes",
      title: "Notes",
      icon: <StickyNote className="w-5 h-5" />,
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Quick Notes</h3>
          <Textarea
            placeholder="Write your thoughts..."
            className="min-h-[100px] bg-background/50"
          />
        </div>
      ),
      position: { x: 380, y: 50 },
      size: { width: 280, height: 200 },
      isCollapsed: false,
    },
    {
      id: "map",
      title: "Map",
      icon: <MapIcon className="w-5 h-5" />,
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Location</h3>
          <div className="bg-muted/30 rounded h-24 flex items-center justify-center text-sm text-muted-foreground">
            Map View
          </div>
        </div>
      ),
      position: { x: 50, y: 280 },
      size: { width: 280, height: 180 },
      isCollapsed: false,
    },
    {
      id: "music",
      title: "Music",
      icon: <Music className="w-5 h-5" />,
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-foreground">Music Player</h3>
          <div className="space-y-2">
            <div className="p-2 bg-muted/50 rounded text-xs">♪ Ambient Focus</div>
            <div className="p-2 bg-muted/50 rounded text-xs">♪ Coding Beats</div>
          </div>
        </div>
      ),
      position: { x: 380, y: 280 },
      size: { width: 280, height: 180 },
      isCollapsed: false,
    },
  ]);

  const [expandedCore, setExpandedCore] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Arlo, your AI assistant. How can I help you today?",
      sender: "arlo",
      timestamp: new Date(),
    },
  ]);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  const dragRef = useRef<HTMLDivElement>(null);

  // SEO
  useEffect(() => {
    document.title = "Arlo AI Dashboard — Modular Cores"; // Title tag
    const desc =
      "Immersive Arlo AI dashboard with modular draggable cores, smooth animations, and dark theme.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    if (meta) meta.content = desc; // Meta description

    // Canonical
    if (!document.querySelector('link[rel="canonical"]')) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = window.location.href;
      document.head.appendChild(link);
    }
  }, []);

  // Connection guard (preserve existing behavior)
  useEffect(() => {
    const verify = async () => {
      if (tailscaleVerified) return;
      const ok = await checkConnection();
      if (!ok) navigate("/unauthorized");
    };
    verify();
  }, [checkConnection, navigate, tailscaleVerified]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: chatInput,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setActiveTab("chat");

    // Simulate Arlo response
    setTimeout(() => {
      const arloResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand you want to discuss that. Let me help you with that.",
        sender: "arlo",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, arloResponse]);
    }, 800);
  };

  const addCore = () => {
    const newCore: Core = {
      id: `core-${Date.now()}`,
      title: "New Core",
      icon: <Camera className="w-5 h-5" />,
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-foreground">New Core</h3>
          <p className="text-sm text-muted-foreground">Configure this core</p>
        </div>
      ),
      position: { x: 100, y: 100 },
      size: { width: 280, height: 200 },
      isCollapsed: false,
    };
    setCores((prev) => [...prev, newCore]);
  };

  const removeCore = (id: string) => {
    setCores((prev) => prev.filter((core) => core.id !== id));
  };

  const toggleCoreCollapse = (id: string) => {
    setCores((prev) =>
      prev.map((core) =>
        core.id === id ? { ...core, isCollapsed: !core.isCollapsed } : core
      )
    );
  };

  const snapToGrid = (value: number, gridSize: number = 20) => {
    return Math.round(value / gridSize) * gridSize;
  };

  const handleCoreDrag = (id: string, x: number, y: number) => {
    setCores((prev) =>
      prev.map((core) =>
        core.id === id
          ? { ...core, position: { x: snapToGrid(x), y: snapToGrid(y) } }
          : core
      )
    );
  };

  const renderDashboard = () => (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={addCore}
          size="sm"
          className="bg-background/80 backdrop-blur-md border border-border/50 hover:bg-background/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Core
        </Button>
      </div>

      <AnimatePresence>
        {cores.map((core) => (
          <motion.div
            key={core.id}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => {}}
            onDragEnd={(_, info) => {
              handleCoreDrag(
                core.id,
                core.position.x + info.offset.x,
                core.position.y + info.offset.y
              );
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: core.position.x,
              y: core.position.y,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute cursor-move"
            style={{
              width: core.isCollapsed ? 60 : core.size.width,
              height: core.isCollapsed ? 60 : core.size.height,
            }}
          >
            <Card className="w-full h-full bg-background/40 backdrop-blur-md border border-border/30 hover:border-border/50 transition-all duration-200">
              <div className="flex items-center justify-between p-3 border-b border-border/20">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  {core.icon}
                  {!core.isCollapsed && (
                    <span className="text-sm font-medium text-foreground">{core.title}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleCoreCollapse(core.id)}
                    className="h-6 w-6 p-0"
                  >
                    {core.isCollapsed ? (
                      <Plus className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setExpandedCore(core.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCore(core.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {!core.isCollapsed && <div className="overflow-hidden">{core.content}</div>}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Expanded Core Overlay */}
      <AnimatePresence>
        {expandedCore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center"
            onClick={() => setExpandedCore(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-[90%] h-[90%] max-w-4xl max-h-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full h-full bg-background/60 backdrop-blur-md border border-border/30">
                <div className="flex items-center justify-between p-4 border-b border-border/20">
                  <div className="flex items-center gap-2">
                    {cores.find((c) => c.id === expandedCore)?.icon}
                    <span className="text-lg font-semibold text-foreground">
                      {cores.find((c) => c.id === expandedCore)?.title}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setExpandedCore(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 h-full overflow-auto">
                  {cores.find((c) => c.id === expandedCore)?.content}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/60 backdrop-blur-md border border-border/30 text-foreground"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 border-t border-border/20">
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Message Arlo..."
            className="flex-1 bg-background/60 backdrop-blur-md border-border/30"
          />
          <Button type="submit" size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Calendar</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-background/40 backdrop-blur-md border border-border/30">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={setCalendarDate}
              className="rounded-md"
            />
          </Card>
          <Card className="p-6 bg-background/40 backdrop-blur-md border border-border/30">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium text-sm text-foreground">Team Meeting</div>
                <div className="text-xs text-muted-foreground">Today, 2:00 PM</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium text-sm text-foreground">Project Review</div>
                <div className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="font-medium text-sm text-foreground">Client Call</div>
                <div className="text-xs text-muted-foreground">Friday, 3:30 PM</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Settings</h2>
        <div className="space-y-6">
          <Card className="p-6 bg-background/40 backdrop-blur-md border border-border/30">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="text-sm font-medium text-foreground">
                  Dark Mode
                </Label>
                <Switch id="dark-mode" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animations" className="text-sm font-medium text-foreground">
                  Animations
                </Label>
                <Switch id="animations" defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/40 backdrop-blur-md border border-border/30">
            <h3 className="text-lg font-semibold mb-4 text-foreground">AI Assistant</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-responses" className="text-sm font-medium text-foreground">
                  Voice Responses
                </Label>
                <Switch id="voice-responses" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-suggestions" className="text-sm font-medium text-foreground">
                  Auto Suggestions
                </Label>
                <Switch id="auto-suggestions" defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-background/40 backdrop-blur-md border border-border/30">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="data-collection" className="text-sm font-medium text-foreground">
                  Data Collection
                </Label>
                <Switch id="data-collection" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="text-sm font-medium text-foreground">
                  Analytics
                </Label>
                <Switch id="analytics" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "chat":
        return renderChat();
      case "calendar":
        return renderCalendar();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  // Guard: if connection failed (non-Tailscale), let existing flow redirect
  if (!tailscaleVerified && !isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0D1117" }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40"
      >
        <Card className="px-2 py-2 bg-background/60 backdrop-blur-md border border-border/30">
          <div className="flex items-center gap-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: Home },
              { id: "chat", label: "Chat", icon: MessageCircle },
              { id: "calendar", label: "Calendar", icon: CalendarIcon },
              { id: "settings", label: "Settings", icon: SettingsIcon },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === (tab.id as any) ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2 px-4 py-2"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </Card>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20 pb-20 h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Chat Input (Dashboard only) */}
      {activeTab === "dashboard" && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed bottom-6 right-6 z-30"
        >
          <Card className="p-4 bg-background/60 backdrop-blur-md border border-border/30 w-80">
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Arlo anything..."
                className="flex-1 bg-background/60 backdrop-blur-md border-border/30"
              />
              <Button type="submit" size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Arlo Badge */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-6 left-6 z-30">
        <Badge className="bg-background/60 backdrop-blur-md border border-border/30 px-3 py-1" variant="secondary">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Arlo AI
        </Badge>
      </motion.div>
    </div>
  );
}
