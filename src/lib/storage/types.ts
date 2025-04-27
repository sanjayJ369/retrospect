import { CalendarYear } from "@/types/calendar";

export interface StorageProvider {
  // calendar year
  getCalendarYear(year: number): Promise<CalendarYear | null>;
}
