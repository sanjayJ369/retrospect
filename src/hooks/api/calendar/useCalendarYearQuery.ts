import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-provider";

export function useCalendarYearQuery(year: number) {
  const { storage } = useAuth();

  return useQuery({
    queryKey: ["calendarYear", year],
    queryFn: () => storage.getCalendarYear(year),
    enabled: !!year,
  });
}
