import { db } from "@/lib/db";
import type { ApiProvider } from "./types";
import type { Task } from "@/types/tasks";
import type { TaskFormData } from "@/schemas/task-schema";
import type {
  CalendarDay,
  CalendarMonth,
  CalendarYear,
} from "@/types/calendar";
import type { Challenge, ChallengeEntry } from "@/types/challenges";
import type { ChallengeFormData } from "@/schemas/challenge-schema";
import { differenceInDays, startOfDay } from "date-fns";

export const OfflineApiProvider: ApiProvider = {
  // --- Calendar Function (Now works correctly) ---
  async getCalendarYear(year: number): Promise<CalendarYear | null> {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const tasksForYear = await db.tasks
      .where("date")
      .between(startOfYear, endOfYear)
      .toArray();

    const activityByDay = new Map<
      string,
      { total: number; completed: number }
    >();
    tasksForYear.forEach((task) => {
      if (!task.date) return;
      const dayKey = task.date.toISOString().slice(0, 10);
      const dayActivity = activityByDay.get(dayKey) || {
        total: 0,
        completed: 0,
      };
      dayActivity.total += 1;
      if (task.done) dayActivity.completed += 1;
      activityByDay.set(dayKey, dayActivity);
    });

    const months: CalendarMonth[] = [];
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const days: CalendarDay[] = [];
      for (let dayIndex = 1; dayIndex <= daysInMonth; dayIndex++) {
        const date = new Date(year, monthIndex, dayIndex);
        const dayKey = date.toISOString().slice(0, 10);
        const activity = activityByDay.get(dayKey);
        const score =
          activity && activity.total > 0
            ? (activity.completed / activity.total) * 100
            : 0;
        days.push({ day: dayIndex, score });
      }
      months.push({ month: monthIndex + 1, days });
    }
    return { year, months };
  },

  // --- Task Functions ---
  async getTask(id: string): Promise<Task | null> {
    return (await db.tasks.get(id)) || null;
  },

  async getAllTasks(date: string): Promise<Task[]> {
    const startDate = startOfDay(new Date(date));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    return db.tasks
      .where("date")
      .between(startDate, endDate, true, false)
      .toArray();
  },

  async createTask(
    taskData: TaskFormData,
  ): Promise<{ task: Task; success: boolean }> {
    const newRecord = {
      ...taskData,
      date: new Date(),
      description: taskData.description ?? "",
      done: false,
    };
    const id = await db.tasks.add(newRecord as Task);
    const newTask = await db.tasks.get(id);
    if (!newTask) throw new Error("Failed to create task in local DB");
    return { task: newTask, success: true };
  },

  async editTask(id: string, newTask: TaskFormData) {
    await db.tasks.update(id, newTask);
    const task = await db.tasks.get(id);
    if (!task) throw new Error(`Task with id ${id} not found after update.`);
    return { task, success: true };
  },

  async deleteTask(id: string): Promise<{ id: string; success: boolean }> {
    await db.tasks.delete(id);
    return { id, success: true };
  },

  async setTaskDone(
    id: string,
    done: boolean,
  ): Promise<{ task: Task; success: boolean }> {
    await db.tasks.update(id, { done });
    const task = await db.tasks.get(id);
    if (!task) throw new Error("Task not found after update in local DB");
    return { task, success: true };
  },

  // --- Challenge Functions ---
  async getAllChallenges(): Promise<Challenge[]> {
    return db.challenges.toArray();
  },

  async createChallenge(
    challengeData: ChallengeFormData,
  ): Promise<{ challenge: Challenge; success: boolean }> {
    const duration = challengeData.endDate
      ? differenceInDays(challengeData.endDate, challengeData.startDate) + 1
      : Infinity;
    const newRecord = {
      ...challengeData,
      description: challengeData.description ?? "",
      endDate: challengeData.endDate || null, // Ensure null is saved
      duration,
    };
    const id = await db.challenges.add(newRecord as Challenge);
    const newChallenge = await db.challenges.get(id);
    if (!newChallenge)
      throw new Error("Failed to create challenge in local DB");
    return { challenge: newChallenge, success: true };
  },

  async getChallenge(id: string): Promise<Challenge> {
    const challenge = await db.challenges.get(id);
    if (!challenge) throw new Error(`Challenge with id ${id} not found.`);
    return challenge;
  },

  async editChallenge(id: string, challengeData: ChallengeFormData) {
    const duration = challengeData.endDate
      ? differenceInDays(challengeData.endDate, challengeData.startDate) + 1
      : Infinity;
    const updatedRecord = {
      ...challengeData,
      description: challengeData.description ?? "",
      endDate: challengeData.endDate || null, // Ensure null is saved correctly
      duration,
    };
    await db.challenges.update(id, updatedRecord);
    const updatedChallenge = await db.challenges.get(id);
    if (!updatedChallenge)
      throw new Error(`Failed to retrieve challenge after update.`);
    return { challenge: updatedChallenge, success: true };
  },

  async deleteChallenge(id: string): Promise<{ id: string; success: boolean }> {
    await db.challenges.delete(id);
    await db.challengeEntries.where({ challengeId: id }).delete();
    return { id, success: true };
  },

  async getChallengeEntries(challengeId: string): Promise<ChallengeEntry[]> {
    if (!challengeId) return [];
    return db.challengeEntries.where({ challengeId }).toArray();
  },

  async markChallengeDone(
    challengeId: string,
    date: Date,
    completed: boolean,
  ): Promise<{ success: boolean; entry: ChallengeEntry }> {
    const dayStart = startOfDay(date);
    const entry = await db.challengeEntries
      .where({ challengeId })
      .and((e) => startOfDay(e.date).getTime() === dayStart.getTime())
      .first();

    if (entry) {
      await db.challengeEntries.update(entry.id!, { completed });
      const updatedEntry = await db.challengeEntries.get(entry.id!);

      console.log("updating entry:", updatedEntry);
      return { success: true, entry: updatedEntry! };
    }
    const newEntry: Omit<ChallengeEntry, "id"> = {
      challengeId,
      date,
      completed,
    };
    const newId = await db.challengeEntries.add(newEntry as ChallengeEntry);
    const createdEntry = await db.challengeEntries.get(newId);
    return { success: true, entry: createdEntry! };
  },

  async markChallengeNotDone(
    challengeId: string,
    date: Date,
  ): Promise<{ success: boolean; entry?: ChallengeEntry }> {
    const result = await this.markChallengeDone(challengeId, date, false);
    return { success: result.success, entry: result.entry };
  },
};
