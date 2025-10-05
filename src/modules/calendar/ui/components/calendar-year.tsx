import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";

interface CalendarYearProps {
  setYear: (year: number) => void;
  year: number;
  years?: number[];
}

const CalendarYear = ({ setYear, year, years }: CalendarYearProps) => {
  const yearOptions =
    years ||
    Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-2/5">
        <Button variant="outline" className="text-xs sm:text-sm md:text-base">
          {year}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-xs rounded-none overflow-clip max-h-60 overflow-y-auto">
        {yearOptions.map((y) => (
          <DropdownMenuItem
            key={y}
            onSelect={() => setYear(y)}
            className="text-xs sm:text-sm md:text-md xl:text-xl"
          >
            {y}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CalendarYear;
