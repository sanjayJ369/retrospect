import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import { memo } from "react";

interface CalendarMonthProps {
  setMonth: (monthIndex: number) => void;
  month: number;
  months?: Date[];
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CalendarMonth = ({ setMonth, month, months }: CalendarMonthProps) => {
  const monthOptions = months
    ? months.map((date) => ({
        index: date.getMonth(),
        name: monthNames[date.getMonth()],
      }))
    : monthNames.map((name, index) => ({ index, name }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-2/5">
        <Button variant="outline" className="text-xs sm:text-sm md:text-base">
          {monthNames[month]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-xs rounded-none overflow-clip">
        {monthOptions.map(({ index, name }) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => setMonth(index)}
            className="text-xs sm:text-sm md:text-md xl:text-xl"
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(CalendarMonth);
