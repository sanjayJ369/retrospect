"use client";
import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import { useSound } from "@/hooks/useSound";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { memo, useState } from "react";

interface CalendarMonthProps {
  setMonth: (year: number) => void;
  month: number;
}

const CalendarMonth = ({ setMonth, month }: CalendarMonthProps) => {
  // const { play } = useSound("/click.mp3");
  // const [pressed, setPressed] = useState(false);

  // const handleClick = async (open: boolean) => {
  //   if (open) {
  //     setPressed(true);
  //     await play();
  //     setPressed(false);
  //   } else {
  //     setPressed(false);
  //   }
  // };

  const monthNames = new Map([
    [0, "jan"],
    [1, "feb"],
    [2, "mar"],
    [3, "apr"],
    [4, "may"],
    [5, "jun"],
    [6, "jul"],
    [7, "aug"],
    [8, "sep"],
    [9, "oct"],
    [10, "nov"],
    [11, "dec"],
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-2/5">
        <Button variant="outline" className="text-xs sm:text-sm md:text-base">
          {monthNames.get(month)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-xs rounded-none overflow-clip">
        {Array.from(monthNames.entries()).map(([k, v]) => (
          <DropdownMenuItem
            key={k}
            onSelect={() => setMonth(k)}
            className="text-xs sm:text-sm md:text-md xl:text-xl"
          >
            {v}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(CalendarMonth);
