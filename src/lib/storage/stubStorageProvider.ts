// src/lib/storage/stubStorageProvider.ts
import type { StorageProvider } from "./types";
import type {
  CalendarYear,
  CalendarMonth,
  CalendarDay,
} from "@/types/calendar";

export const StubStorageProvider: StorageProvider = {
  async getCalendarYear(year: number): Promise<CalendarYear> {
    const months: CalendarMonth[] = [];

    for (let month = 1; month <= 12; month++) {
      const daysInMonth = getDaysInMonth(year, month);
      const days: CalendarDay[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          day,
          score: getRandomScore(), // random score for each day
        });
      }

      months.push({ month, days });
    }

    return { year, months };
  },
};

// Helper: how many days in a given month/year
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Helper: random score between 0 and 100 (or whatever you want)
function getRandomScore(): number {
  return Math.floor(Math.random() * 101);
}
