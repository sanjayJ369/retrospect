"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/8bit/dropdown-menu";
import { Button } from "./ui/8bit/button";
import { baseThemes, useTheme } from "@/context/custom-theme-provider";
import { Palette, CheckIcon } from "lucide-react";
export default function BaseThemeSelector() {
  const { baseTheme, setBaseTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center"
          size={"icon"}
        >
          <Palette className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {baseThemes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => setBaseTheme(theme)}
            className="flex items-center justify-between"
          >
            {theme.charAt(0).toUpperCase() + theme.slice(1)}

            {baseTheme === theme ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <div className="w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
