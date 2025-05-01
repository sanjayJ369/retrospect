import { Card } from "@/components/ui/8bit/card";
import Container from "@/components/ui/8bit/container";
import { cn } from "@/lib/utils";
import { CalendarMonth } from "@/types/calendar";
import { memo } from "react";

interface CalendarMonthProps {
  monthData: CalendarMonth;
  className?: string;
}

const CalendarMonthCard = ({ monthData, className }: CalendarMonthProps) => {
  return (
    <Card className={cn("w-full h-full", className)}>
      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1 sm:gap-2
          md:gap-3 p-1 sm:p-2 md:p-3 h-full"
      >
        {monthData.days.map((day) => (
          <Container
            key={day.day}
            className={
              "rounded p-1 sm:p-2 text-center text-xs sm:text-sm md:text-base"
            }
            style={{
              backgroundColor: `rgba(120, 255, 120, ${1 - day.score * 0.01})`,
            }}
          >
            {day.day}
          </Container>
        ))}
      </div>
    </Card>
  );
};

export default memo(CalendarMonthCard);
