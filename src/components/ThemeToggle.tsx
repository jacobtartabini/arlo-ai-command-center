import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/providers/ThemeProvider";
import { Moon, Sun, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium leading-none text-foreground">Theme</legend>
      <RadioGroup
        className="flex gap-2"
        value={theme}
        onValueChange={(val) => {
          if (val === "light" || val === "dark" || val === "system") setTheme(val);
        }}
      >
        <label className="flex flex-col items-center">
          <RadioGroupItem id="theme-light" value="light" className="peer sr-only after:absolute after:inset-0" />
          <div className="relative cursor-pointer overflow-hidden rounded-md border border-input bg-background/70 p-3 shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent">
            <Sun className="h-4 w-4" />
          </div>
          <span className="mt-1 text-xs">Light</span>
        </label>
        <label className="flex flex-col items-center">
          <RadioGroupItem id="theme-dark" value="dark" className="peer sr-only after:absolute after:inset-0" />
          <div className="relative cursor-pointer overflow-hidden rounded-md border border-input bg-background/70 p-3 shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent">
            <Moon className="h-4 w-4" />
          </div>
          <span className="mt-1 text-xs">Dark</span>
        </label>
        <label className="flex flex-col items-center">
          <RadioGroupItem id="theme-system" value="system" className="peer sr-only after:absolute after:inset-0" />
          <div className="relative cursor-pointer overflow-hidden rounded-md border border-input bg-background/70 p-3 shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-2 peer-[:focus-visible]:outline-ring/70 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent">
            <Monitor className="h-4 w-4" />
          </div>
          <span className="mt-1 text-xs">System</span>
        </label>
      </RadioGroup>
    </fieldset>
  );
}
