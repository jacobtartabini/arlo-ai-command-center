import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, MessageCircle, Calendar as CalendarIcon, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/calendar", label: "Calendar", icon: CalendarIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function NavBar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
      <Card className="px-2 py-2 bg-background/60 backdrop-blur-md border border-border/30">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <NavLink key={tab.to} to={tab.to} end className={({ isActive }) => isActive ? "" : ""}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              )}
            </NavLink>
          ))}
        </div>
      </Card>
    </nav>
  );
}
