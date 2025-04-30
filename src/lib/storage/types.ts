import { TaskFormData } from "@/schemas/task-schema";
import { CalendarYear } from "@/types/calendar";
import { Task } from "@/types/tasks";

export interface StorageProvider {
  // calendar year
  getCalendarYear(year: number): Promise<CalendarYear | null>;

  // tasks
  getTask(id: string): Promise<Task | null>;
  deleteTask(id: string): Promise<{ id: string; success: boolean }>;
  editTask(
    id: string,
    newTask: Task,
  ): Promise<{ task: Task; success: boolean }>;
  createTask(task: TaskFormData): Promise<{ task: Task; success: boolean }>;

  getAllTasks(date: string): Promise<Task[]>;
}
