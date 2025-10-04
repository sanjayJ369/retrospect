import type { ApiProvider } from "./types";
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
import { differenceInDays } from "date-fns";

const tasks: Task[] = [];
let challenges: Challenge[] = [];
const completetions: Map<string, Map<Date, ChallengeEntry>> = new Map();

function genId(prefix = "task") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// stub challenges data
const today = new Date();
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);
const twoWeeksFromNow = new Date();
twoWeeksFromNow.setDate(today.getDate() + 14);
const oneMonthFromNow = new Date();
oneMonthFromNow.setMonth(today.getMonth() + 1);

// Initial challenges
const initialChallenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Morning Meditation",
    description: "Meditate for 10 minutes every morning",
    startDate: lastWeek,
    endDate: oneMonthFromNow,
    duration: getDuration(lastWeek, oneMonthFromNow),
  },
  {
    id: "challenge-2",
    title: "Daily Exercise",
    description: "Complete 30 minutes of physical activity",
    startDate: today,
    endDate: twoWeeksFromNow,
    duration: getDuration(today, twoWeeksFromNow),
  },
  {
    id: "challenge-3",
    title: "Reading Habit",
    description: "Read 20 pages of a book each day",
    startDate: lastWeek,
    endDate: oneMonthFromNow,
    duration: getDuration(lastWeek, oneMonthFromNow),
  },
  {
    id: "challenge-4",
    title: "Water Intake",
    description: "Drink 8 glasses of water daily",
    startDate: today,
    endDate: oneMonthFromNow,
    duration: getDuration(today, oneMonthFromNow),
  },
];
challenges = [...initialChallenges];
// Initialize completions for each challenge
initialChallenges.forEach((challenge) => {
  const entries = dateRange(challenge.startDate, challenge.endDate);
  completetions.set(challenge.id, new Map());

  // Set random completion status for past dates
  entries.forEach((date) => {
    if (date <= today) {
      const isCompleted = Math.random() > 0.3; // 70% chance of completion
      completetions.get(challenge.id)?.set(date, {
        id: genId("entry"),
        challengeId: challenge.id,
        date: date,
        completed: isCompleted,
      });
    } else {
      // Future dates are not completed
      completetions.get(challenge.id)?.set(date, {
        id: genId("entry"),
        challengeId: challenge.id,
        date: date,
        completed: false,
      });
    }
  });
});

export const StubApiProvider: ApiProvider = {
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

  async getAllTasks(): Promise<Task[]> {
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
      duration: getDuration(challengeData.startDate, challengeData.endDate),
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

  async setTaskDone(
    id: string,
    done: boolean,
  ): Promise<{ task: Task; success: boolean }> {
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    task.done = done;
    return { task, success: true };
  },

  async editChallenge(
    id: string,
    challengeData: ChallengeFormData,
  ): Promise<{ challenge: Challenge; success: boolean }> {
    const challengeIndex = challenges.findIndex((c) => c.id === id);
    if (challengeIndex === -1) {
      throw new Error("Challenge not found");
    }
    const oldChallenge = challenges[challengeIndex];
    const newChallenge: Challenge = {
      ...oldChallenge,
      title: challengeData.title,
      description: challengeData.description ?? "",
      startDate: challengeData.startDate,
      endDate: challengeData.endDate,
      duration:
        differenceInDays(challengeData.endDate, challengeData.startDate) + 1,
    };
    challenges[challengeIndex] = newChallenge;

    // In a real scenario, you might want to update the completions map as well
    // especially if the date range changes.
    // For this stub, we'll keep it simple.

    return {
      challenge: newChallenge,
      success: true,
    };
  },

  async markChallengeDone(
    id: string,
    date: Date,
    done: boolean,
  ): Promise<{ success: boolean; entry: ChallengeEntry }> {
    const challengeCompletions = completetions.get(id);
    if (!challengeCompletions) {
      // Or handle as per desired logic, maybe throw an error
      throw new Error(`No completions found for challenge id: ${id}`);
    }

    let entryToUpdate: ChallengeEntry | undefined;
    let entryDateToUpdate: Date | undefined;

    for (const [entryDate, entry] of challengeCompletions.entries()) {
      if (
        entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate()
      ) {
        entryToUpdate = entry;
        entryDateToUpdate = entryDate;
        break;
      }
    }

    if (entryToUpdate && entryDateToUpdate) {
      entryToUpdate.completed = done;
      challengeCompletions.set(entryDateToUpdate, entryToUpdate);
      return { success: true, entry: entryToUpdate };
    }

    // If no entry for that date, we might need to create one
    const newEntry: ChallengeEntry = {
      id: genId(),
      challengeId: id,
      date: date,
      completed: done,
    };
    challengeCompletions.set(date, newEntry);

    return { success: true, entry: newEntry };
  },

  async markChallengeNotDone(
    id: string,
    date: Date,
  ): Promise<{ success: boolean }> {
    const challengeCompletions = completetions.get(id);
    if (!challengeCompletions) {
      return { success: false };
    }

    let entryToUpdate: ChallengeEntry | undefined;
    let entryDateToUpdate: Date | undefined;

    for (const [entryDate, entry] of challengeCompletions.entries()) {
      if (
        entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate()
      ) {
        entryToUpdate = entry;
        entryDateToUpdate = entryDate;
        break;
      }
    }

    if (entryToUpdate && entryDateToUpdate) {
      entryToUpdate.completed = false;
      challengeCompletions.set(entryDateToUpdate, entryToUpdate);
    }

    return { success: true };
  },
};

function getDuration(start: Date, end: Date): number {
  return (
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
}
