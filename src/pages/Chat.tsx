import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "arlo";
  timestamp: Date;
}

export default function Chat() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Arlo, your AI assistant. How can I help you today?",
      sender: "arlo",
      timestamp: new Date(),
    },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "Chat – Arlo AI";
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    setTimeout(() => {
      const arloResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Got it. Here's what I found.",
        sender: "arlo",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, arloResponse]);
    }, 800);
  };

  return (
    <main className="min-h-screen pt-20 pb-24">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
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
          <div ref={endRef} />
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
    </main>
  );
}
