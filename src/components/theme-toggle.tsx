"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const switchSound = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    switchSound.current = new Audio("/light-switch.mp3");
  }, []);

  const handleThemeChange = (theme: string) => {
    if (switchSound.current) {
      switchSound.current.currentTime = 0;
      switchSound.current.volume = 0.15;
      switchSound.current.play().catch((err) => {
        console.warn("Audio failed to play:", err);
      });
    }
    setTheme(theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90
              dark:scale-0"
          />
          <Moon
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0
              dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
