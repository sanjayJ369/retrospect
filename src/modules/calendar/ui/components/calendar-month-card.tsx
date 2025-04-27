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
    <Card className={cn(className)}>
      <div className="grid grid-cols-4 gap-4 p-3">
        {monthData.days.map((day) => (
          <Container
            key={day.day}
            className={"rounded p-2 text-center"}
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
