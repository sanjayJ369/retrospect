import type { StorageProvider } from "./types";
import type { Task } from "@/types/tasks";
import type {
  CalendarYear,
  CalendarMonth,
  CalendarDay,
} from "@/types/calendar";
import type { TaskFormData } from "@/schemas/task-schema";

const tasks: Task[] = [];

function genId() {
  return `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export const StubStorageProvider: StorageProvider = {
  async getCalendarYear(year: number): Promise<CalendarYear | null> {
    if (Math.random() < 0.1) return null;
    const months: CalendarMonth[] = [];
    for (let m = 1; m <= 12; m++) {
      const daysInMonth = new Date(year, m, 0).getDate();
      const days: CalendarDay[] = [];
      for (let d = 1; d <= daysInMonth; d++) {
        days.push({ day: d, score: Math.floor(Math.random() * 101) });
      }
      months.push({ month: m, days });
    }
    return { year, months };
  },

  async getTask(id: string): Promise<Task | null> {
    const task = tasks.find((t) => t.id === id) ?? null;
    return task;
  },

  async getAllTasks(_date: string): Promise<Task[]> {
    return [...tasks];
  },

  async createTask(
    data: TaskFormData,
  ): Promise<{ task: Task; success: boolean }> {
    const newTask: Task = {
      id: genId(),
      done: false,
      title: data.title,
      description: data.description ?? "",
      duration: data.duration ?? 0,
    };
    tasks.push(newTask);
    return { task: newTask, success: true };
  },

  async editTask(
    id: string,
    newTask: Task,
  ): Promise<{ task: Task; success: boolean }> {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    tasks[idx] = { ...tasks[idx], ...newTask, id };
    return { task: tasks[idx], success: true };
  },

  async deleteTask(id: string): Promise<{ id: string; success: boolean }> {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    tasks.splice(idx, 1);
    return { id, success: true };
  },
};
