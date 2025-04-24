"use client";
import { Press_Start_2P } from "next/font/google";
import { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "./button";
import { useSound } from "@/hooks/useSound";

const pressStart = Press_Start_2P({
  weight: ["400"],
  subsets: ["latin"],
});

export interface BitNavButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href: string;
  ref?: React.Ref<HTMLButtonElement>;
}

function NavButton({ href, children, ...props }: BitNavButtonProps) {
  const { variant, size, className, font } = props;
  const router = useRouter();
  const { play } = useSound("/click.mp3");

  const handleClick = async () => {
    await play();
    router.push(href);
  };

  return (
    <ShadcnButton
      onClick={handleClick}
      {...props}
      className={cn(
        "rounded-none active:translate-y-1 transition-transform relative",
        font !== "normal" && pressStart.className,
        className,
      )}
      size={size}
      variant={variant}
    >
      {children}

      {variant !== "ghost" && variant !== "link" && size !== "icon" && (
        <>
          {/* Pixelated border */}
          <div
            className="absolute -top-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-foreground
              dark:bg-ring"
          />
          <div
            className="absolute -top-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-foreground
              dark:bg-ring"
          />
          <div
            className="absolute -bottom-1.5 w-1/2 left-1.5 h-1.5 bg-foreground dark:bg-foreground
              dark:bg-ring"
          />
          <div
            className="absolute -bottom-1.5 w-1/2 right-1.5 h-1.5 bg-foreground dark:bg-foreground
              dark:bg-ring"
          />
          <div className="absolute top-0 left-0 size-1.5 bg-foreground dark:bg-foreground dark:bg-ring" />
          <div className="absolute top-0 right-0 size-1.5 bg-foreground dark:bg-foreground dark:bg-ring" />
          <div className="absolute bottom-0 left-0 size-1.5 bg-foreground dark:bg-foreground dark:bg-ring" />
          <div className="absolute bottom-0 right-0 size-1.5 bg-foreground dark:bg-foreground dark:bg-ring" />
          <div
            className="absolute top-1.5 -left-1.5 h-2/3 w-1.5 bg-foreground dark:bg-foreground
              dark:bg-ring"
          />
          <div
            className="absolute top-1.5 -right-1.5 h-2/3 w-1.5 bg-foreground dark:bg-foreground
              dark:bg-ring"
          />
          {variant !== "outline" && (
            <>
              {/* Top shadow */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-foreground/20" />
              <div className="absolute top-1.5 left-0 w-3 h-1.5 bg-foreground/20" />

              {/* Bottom shadow */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-foreground/20" />
              <div className="absolute bottom-1.5 right-0 w-3 h-1.5 bg-foreground/20" />
            </>
          )}
        </>
      )}

      {size === "icon" && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring
              pointer-events-none"
          />
          <div
            className="absolute bottom-0 w-full h-[5px] md:h-1.5 bg-foreground dark:bg-ring
              pointer-events-none"
          />
          <div
            className="absolute top-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring
              pointer-events-none"
          />
          <div
            className="absolute bottom-1 -left-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring
              pointer-events-none"
          />
          <div
            className="absolute top-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring
              pointer-events-none"
          />
          <div
            className="absolute bottom-1 -right-1 w-[5px] md:w-1.5 h-1/2 bg-foreground dark:bg-ring
              pointer-events-none"
          />
        </>
      )}
    </ShadcnButton>
  );
}

export { NavButton };
