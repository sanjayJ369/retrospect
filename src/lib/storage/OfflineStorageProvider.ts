import { db } from "@/lib/db";
import type { StorageProvider } from "./types";
import type { Task } from "@/types/tasks";
import type { TaskFormData } from "@/schemas/task-schema";
import type { CalendarYear } from "@/types/calendar";
import type { Challenge, ChallengeEntry } from "@/types/challenges";
import type { ChallengeFormData } from "@/schemas/challenge-schema";

export const OfflineStorageProvider: StorageProvider = {
  async getCalendarYear(year: number): Promise<CalendarYear | null> {
    // Dexie doesn't directly support the complex query needed for a calendar.
    // This would need a more complex implementation, possibly denormalizing data.
    // For now, we'll return an empty calendar structure.
    console.warn("Offline mode: getCalendarYear is not fully implemented.");
    return {
      year,
      months: [],
    };
  },

  async getTask(id: string): Promise<Task | null> {
    return (await db.tasks.get(id)) || null;
  },

  async deleteTask(id: string): Promise<{ id: string; success: boolean }> {
    await db.tasks.delete(id);
    return { id, success: true };
  },

  async editTask(id: string, newTask: TaskFormData) {
    await db.tasks.update(id, newTask);
    const task = await db.tasks.get(id);
    return { task: task!, success: true };
  },

  async createTask(task: TaskFormData) {
    // Dexie's add will return the ID.
    const id = await db.tasks.add({
      ...task,
      id: crypto.randomUUID(),
      done: false,
    });
    const newTask = await db.tasks.get(id);
    return { task: newTask!, success: true };
  },

  async getAllTasks() {
    // This is a simplification. In a real app, you'd filter by date.
    return db.tasks.toArray();
  },

  async getChallenge(id: string): Promise<Challenge | null> {
    return (await db.challenges.get(id)) || null;
  },

  async getAllChallenges() {
    return db.challenges.toArray();
  },

  async createChallenge(challenge: ChallengeFormData) {
    const id = await db.challenges.add({
      ...challenge,
      id: crypto.randomUUID(),
    });
    const newChallenge = await db.challenges.get(id);
    return { challenge: newChallenge!, success: true };
  },

  async editChallenge(id: string, newChallenge: ChallengeFormData) {
    await db.challenges.update(id, newChallenge);
    const challenge = await db.challenges.get(id);
    return { challenge: challenge!, success: true };
  },

  async deleteChallenge(id: string) {
    await db.challenges.delete(id);
    await db.challengeEntries.where({ challengeId: id }).delete();
    return { id, success: true };
  },

  async getAllChallengeEntries(challengeId: string) {
    return db.challengeEntries.where({ challengeId }).toArray();
  },

  async setChallengeEntryDone(
    id: string,
    done: boolean,
  ): Promise<{ entry: ChallengeEntry; success: boolean }> {
    await db.challengeEntries.update(id, { done });
    const entry = await db.challengeEntries.get(id);
    return { entry: entry!, success: true };
  },

  async login(password: string, email: string): Promise<{ success: boolean }> {
    throw new Error("Method not implemented.");
  },
  async signup(password: string, email: string): Promise<{ success: boolean }> {
    throw new Error("Method not implemented.");
  },
  async logout(): Promise<{ success: boolean }> {
    throw new Error("Method not implemented.");
  },
  async forgotPassword(email: string): Promise<{ success: boolean }> {
    throw new Error("Method not implemented.");
  },
  async resetPassword(password: string): Promise<{ success: boolean }> {
    throw new Error("Method not implemented.");
  },
};
