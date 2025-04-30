import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { inputVariants } from "./input"; // assuming you're using same styling variants
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { Press_Start_2P } from "next/font/google";

const pressStart = Press_Start_2P({ weight: ["400"], subsets: ["latin"] });

export interface BitTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputVariants> {
  font?: "normal" | "retro";
}

export const Textarea = forwardRef<HTMLTextAreaElement, BitTextareaProps>(
  ({ className, font = "normal", ...props }, ref) => {
    return (
      <div className={cn("relative w-full", className)}>
        <ShadcnTextarea
          ref={ref}
          className={cn(
            "rounded-none transition-transform ring-0 border-0",
            font !== "normal" && pressStart.className,
            className,
          )}
          {...props}
        />

        <div
          className="absolute inset-0 border-y-6 -my-1.5 border-foreground dark:border-ring
            pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring
            pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
