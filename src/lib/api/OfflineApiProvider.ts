import { db } from "@/lib/db";
import type { ApiProvider } from "./types";
import type { Task } from "@/types/tasks";
import type { TaskFormData } from "@/schemas/task-schema";
import type { CalendarYear } from "@/types/calendar";
import type { Challenge, ChallengeEntry } from "@/types/challenges";
import type { ChallengeFormData } from "@/schemas/challenge-schema";

export const OfflineApiProvider: ApiProvider = {
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
      description: task.description ?? "",
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

  async setTaskDone(
    id: string,
    done: boolean,
  ): Promise<{ task: Task; success: boolean }> {
    await db.tasks.update(id, { done });
    const task = await db.tasks.get(id);
    if (!task) {
      throw new Error("Task not found after update");
    }
    return { task, success: true };
  },

  async getChallenge(id: string): Promise<Challenge> {
    const challenge = await db.challenges.get(id);
    if (!challenge) {
      throw new Error(`Challenge with id ${id} not found.`);
    }
    return challenge;
  },

  async getAllChallenges() {
    return db.challenges.toArray();
  },

  async createChallenge(challenge: ChallengeFormData) {
    const duration = Math.ceil(
      (challenge.endDate.getTime() - challenge.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const id = await db.challenges.add({
      ...challenge,
      description: challenge.description ?? "",
      duration,
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

  async getChallengeEntries(challengeId: string) {
    return db.challengeEntries.where({ challengeId }).toArray();
  },

  async markChallengeDone(
    challengeId: string,
    date: Date,
    done: boolean,
  ): Promise<{ success: boolean; entry: ChallengeEntry }> {
    const entry = await db.challengeEntries
      .where({ challengeId, date })
      .first();
    if (entry) {
      await db.challengeEntries.update(entry.id, { completed: done });
      const updatedEntry = await db.challengeEntries.get(entry.id);
      return { success: true, entry: updatedEntry! };
    }
    const newEntry: ChallengeEntry = {
      id: crypto.randomUUID(),
      challengeId,
      date,
      completed: done,
    };
    await db.challengeEntries.add(newEntry);
    return { success: true, entry: newEntry };
  },

  async markChallengeNotDone(
    challengeId: string,
    date: Date,
  ): Promise<{ success: boolean }> {
    const entry = await db.challengeEntries
      .where({ challengeId, date })
      .first();
    if (entry) {
      await db.challengeEntries.update(entry.id, { completed: false });
    }
    return { success: true };
  },
};
