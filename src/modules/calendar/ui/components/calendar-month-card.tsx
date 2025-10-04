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
    <Card className={cn("w-full h-full ", className)}>
      <div className="grid grid-cols-7 gap-1 px-4">
        {monthData &&
          monthData.days.map((day) => (
            <div key={day.day} className="flex items-center justify-center">
              <Container
                className="p-3 flex-0 w-4 h-4 sm:w-auto sm:h-auto"
                style={{
                  backgroundColor: `rgba(120, 255, 120, ${1 - day.score * 0.01})`,
                }}
              >
                <span className="hidden sm:block w-6 h-6 md:w-6 md:h-6 lg:w-8 text-center">
                  {day.day}
                </span>
                <div className="block sm:hidden w-1 h-1"></div>
              </Container>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default memo(CalendarMonthCard);
