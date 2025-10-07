import { Card } from "@/components/ui/8bit/card";
import Container from "@/components/ui/8bit/container";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/8bit/checkbox";

export type DayState = {
  id?: string;
  date: Date;
  status: "completed" | "not-completed" | "future" | "disabled";
  isToday: boolean;
};

interface ChallengeDaysCardProps {
  days: DayState[];
  onToggleDay: (date: Date, completed: boolean) => void;
  isMutating: boolean;
}

const ChallengeDaysCard = ({
  days,
  onToggleDay,
  isMutating,
}: ChallengeDaysCardProps) => {
  if (!days || days.length === 0) {
    return (
      <Card
        className={cn("w-full h-full p-2 flex items-center justify-center")}
      >
        <p className="text-xs text-neutral-400">No data for this month.</p>
      </Card>
    );
  }

  const firstDayOfMonth = days[0].date.getDay(); // Sunday = 0
  return (
    <Card>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`placeholder-${i}`} />
        ))}

        {days.map((day) => {
          const dayStyles = {
            "bg-green-500/80": day.status === "completed",
            "bg-neutral-200 dark:bg-neutral-800":
              day.status === "not-completed",
            "bg-transparent": day.status === "future",
            "bg-neutral-100 dark:bg-neutral-900 text-neutral-400":
              day.status === "disabled",
            "border-2 border-blue-500": day.isToday,
          };

          return (
            <div
              key={day.date.toISOString()}
              className="flex items-center justify-center"
            >
              {day.isToday && onToggleDay ? (
                <>
                  <Container>
                    <Checkbox
                      className="size-10"
                      checked={day.status === "completed"}
                      disabled={isMutating}
                      onCheckedChange={(checked) => {
                        if (onToggleDay) {
                          onToggleDay(day.date, !!checked);
                        }
                      }}
                    />
                  </Container>
                </>
              ) : (
                <>
                  <Container
                    className={cn(
                      "p-3 flex-0 w-4 h-4 sm:w-auto sm:h-auto flex items-center justify-center",
                      dayStyles,
                    )}
                  >
                    <span className="hidden sm:block w-6 h-6 text-center leading-6">
                      {day.date.getDate()}
                    </span>
                  </Container>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ChallengeDaysCard;
