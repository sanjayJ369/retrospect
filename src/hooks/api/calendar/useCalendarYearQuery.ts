import { useQuery } from "@tanstack/react-query";
import { getStorageProvider } from "@/lib/storage/StorageProvider";

export function useCalendarYearQuery(year: number) {
  const storage = getStorageProvider();

  return useQuery({
    queryKey: ["calendarYear", year],
    queryFn: () => storage.getCalendarYear(year),
    enabled: !!year,
  });
}
