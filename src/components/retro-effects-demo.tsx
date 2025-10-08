"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const effects = [
  { name: "None", class: "" },
  { name: "CRT Scanlines", class: "retro-scanlines" },
  { name: "CRT Curve", class: "retro-crt-curve" },
  { name: "VHS Distortion", class: "retro-vhs" },
  { name: "VHS Noise", class: "retro-vhs-noise" },
  { name: "Pixel Grid", class: "retro-pixel-grid" },
  { name: "CRT Glow", class: "retro-crt-glow" },
  { name: "Screen Flicker", class: "retro-flicker" },
  { name: "Chromatic", class: "retro-chromatic" },
  { name: "Burn-in", class: "retro-burn-in" },
  { name: "Dot Matrix", class: "retro-dot-matrix" },
  { name: "Game Boy LCD", class: "retro-gameboy-lcd" },
  { name: "Arcade Glow", class: "retro-arcade-glow" },
  { name: "Interlaced", class: "retro-interlaced" },
  { name: "Full CRT", class: "retro-full-crt" },
  { name: "Full CRT + VHS Noise", class: "retro-full-crt retro-vhs-noise" },
  { name: "Scanlines + Pixel Grid", class: "retro-scanlines retro-pixel-grid" },
  {
    name: "Arcade Max",
    class: "retro-arcade-glow retro-scanlines retro-chromatic",
  },
];

export function RetroEffectsDemo() {
  const [activeEffect, setActiveEffect] = useState("");

  return (
    <div className="min-h-screen p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">🎮 Retro Effects Demo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click a button to preview different retro overlay effects
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
            {effects.map((effect) => (
              <Button
                key={effect.name}
                onClick={() => {
                  // Remove all effect classes from body
                  document.body.className = document.body.className
                    .split(" ")
                    .filter((cls) => !cls.startsWith("retro-"))
                    .join(" ");

                  // Add the new effect class(es)
                  if (effect.class) {
                    document.body.classList.add(...effect.class.split(" "));
                  }
                  setActiveEffect(effect.class);
                }}
                variant={activeEffect === effect.class ? "default" : "outline"}
                size="sm"
              >
                {effect.name}
              </Button>
            ))}
          </div>

          <div className="space-y-4 p-6 bg-background/50 rounded-lg border">
            <h3 className="text-lg font-bold">Sample Content</h3>
            <p className="text-sm">
              This text should be affected by the retro overlay effects. Look
              for:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Horizontal scanlines (CRT/Scanlines effects)</li>
              <li>Static/noise texture (VHS Noise, Pixel Grid)</li>
              <li>Darkened edges (Vignette/Burn-in)</li>
              <li>Subtle animations (Flicker, Chromatic)</li>
              <li>Text glow (CRT Glow)</li>
            </ul>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-primary text-primary-foreground p-4 rounded">
                Primary
              </div>
              <div className="bg-secondary text-secondary-foreground p-4 rounded">
                Secondary
              </div>
              <div className="bg-accent text-accent-foreground p-4 rounded">
                Accent
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Current effect: <strong>{activeEffect || "None"}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              💡 Tip: Effects are more visible on darker themes. Try switching
              to dark mode!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
