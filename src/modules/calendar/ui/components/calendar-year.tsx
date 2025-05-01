import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

interface CalendarYearProps {
  setYear: (year: number) => void;
  year: number;
}

const CalendarYear = ({ setYear, year }: CalendarYearProps) => {
  const startYear = 2000;
  const endYear = new Date().getFullYear();
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full sm:w-36 md:w-44">
        <Button variant="outline" className="text-xs sm:text-sm md:text-base">
          {year}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-xs w-32 sm:w-44 md:w-56 rounded-none overflow-clip max-h-60 overflow-y-auto">
        {years.map((y) => (
          <DropdownMenuItem key={y} onSelect={() => setYear(y)}>
            {y}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CalendarYear;
