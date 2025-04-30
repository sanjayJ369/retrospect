import { CalendarYear } from "@/types/calendar";
import { Task } from "@/types/tasks";

export interface StorageProvider {
  // calendar year
  getCalendarYear(year: number): Promise<CalendarYear | null>;

  // tasks
  getTask(id: string): Promise<Task | null>;
  deleteTask(id: string): Promise<{ id: string }>;
}
