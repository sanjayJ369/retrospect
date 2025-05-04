import type { StorageProvider } from "./types";
import type { Task } from "@/types/tasks";
import type {
  CalendarYear,
  CalendarMonth,
  CalendarDay,
} from "@/types/calendar";
import type { TaskFormData } from "@/schemas/task-schema";
import type { ChallengeFormData } from "@/schemas/challenge-schema";
import { Challenge, ChallengeEntry } from "@/types/challenges";
import { dateRange } from "../utils";

const tasks: Task[] = [];
const challenges: Challenge[] = [];
const completetions: Map<string, Map<Date, ChallengeEntry>> = new Map();

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

  // Challenges implementation
  async getAllChallenges(): Promise<Challenge[]> {
    return [...challenges];
  },

  async getChallenge(id: string): Promise<Challenge> {
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) throw new Error("Challenge not found");
    return challenge;
  },

  async deleteChallenge(id: string): Promise<{ id: string; success: boolean }> {
    const idx = challenges.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Challenge not found");
    challenges.splice(idx, 1);
    // Also clean up any completions for this challenge
    completetions.delete(id);
    return { id, success: true };
  },

  async getChallengeEntries(id: string): Promise<ChallengeEntry[]> {
    const challengeEntries = completetions.get(id);
    if (!challengeEntries) return [];
    return Array.from(challengeEntries.values());
  },

  async createChallenge(
    challengeData: ChallengeFormData,
  ): Promise<{ challenge: Challenge; success: boolean }> {
    const newChallenge: Challenge = {
      id: genId(),
      title: challengeData.title,
      description: challengeData.description || "",
      startDate: challengeData.startDate,
      endDate: challengeData.endDate,
      duration: challengeData.duration,
    };

    challenges.push(newChallenge);
    const entries = dateRange(newChallenge.startDate, newChallenge.endDate);
    completetions.set(newChallenge.id, new Map());
    entries.forEach((entry) => {
      completetions.get(newChallenge.id)?.set(entry, {
        id: genId(),
        challengeId: newChallenge.id,
        date: entry,
        completed: false,
      });
    });

    return {
      challenge: newChallenge,
      success: true,
    };
  },

  async markChallengeDone(id: string): Promise<{ success: boolean }> {
    completetions.get(id)?.set(new Date(), {
      id: genId(),
      challengeId: id,
      date: new Date(),
      completed: true,
    });
    return { success: true };
  },

  async markChallengeNotDone(id: string): Promise<{ success: boolean }> {
    completetions.get(id)?.set(new Date(), {
      id: genId(),
      challengeId: id,
      date: new Date(),
      completed: false,
    });
    return { success: true };
  },
};
