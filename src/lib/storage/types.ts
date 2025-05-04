import { ChallengeFormData } from "@/schemas/challenge-schema";
import { TaskFormData } from "@/schemas/task-schema";
import { CalendarYear } from "@/types/calendar";
import { Challenge, ChallengeEntry } from "@/types/challenges";
import { Task } from "@/types/tasks";

export interface StorageProvider {
  // calendar year
  getCalendarYear(year: number): Promise<CalendarYear | null>;

  // tasks
  getTask(id: string): Promise<Task | null>;
  deleteTask(id: string): Promise<{ id: string; success: boolean }>;
  editTask(
    id: string,
    newTask: TaskFormData,
  ): Promise<{ task: Task; success: boolean }>;
  createTask(task: TaskFormData): Promise<{ task: Task; success: boolean }>;
  getAllTasks(date: string): Promise<Task[]>;

  // challenges
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge>;
  getChallengeEntries(id: string): Promise<ChallengeEntry[]>;
  deleteChallenge(id: string): Promise<{ id: string; success: boolean }>;
  createChallenge(
    challenge: ChallengeFormData,
  ): Promise<{ challenge: Challenge; success: boolean }>;
  editChallenge(
    challenge: ChallengeFormData,
  ): Promise<{ challenge: Challenge; success: boolean }>;

  // id -> challenge, date -> date
  markChallengeDone(id: string): Promise<{ success: boolean }>;
  markChallengeNotDone(id: string): Promise<{ success: boolean }>;
}
