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
      <DropdownMenuTrigger asChild className="w-1/3">
        <Button variant="outline">{year}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-xs w-56 rounded-none overflow-clip">
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
