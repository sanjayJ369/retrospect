"use client";
import Container from "@/components/ui/8bit/container";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChallengeHistoryEntryProps {
  title: string;
  completed: boolean;
  date: Date;
}

const ChallengeHistoryEntry = ({
  title,
  completed,
  date,
}: ChallengeHistoryEntryProps) => {
  return (
    <Container
      className={cn(
        `flex gap-3 items-center p-3 justify-between flex-col sm:flex-row w-full
        cursor-default`,
        completed
          ? "bg-green-100 dark:bg-green-900/30 border-green-500/50"
          : "bg-amber-50 dark:bg-amber-900/20 border-amber-500/50",
      )}
    >
      <div className="flex items-center gap-3 w-full">
        <div
          className={cn(
            "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0",
            completed
              ? "bg-green-500 border-green-600 dark:bg-green-600 dark:border-green-500"
              : "bg-background border-foreground dark:border-ring",
          )}
        >
          {completed && (
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 flex items-center justify-between">
          <p
            className={cn(
              "text-sx sm:text-sm md:text-md xl:text-xl",
              completed && "line-through opacity-70",
            )}
          >
            {title}
          </p>
          <span className="text-xs text-muted-foreground ml-2">
            {format(date, "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </Container>
  );
};

export default ChallengeHistoryEntry;
