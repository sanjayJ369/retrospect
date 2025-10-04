import { ChallengeFormData } from "@/schemas/challenge-schema";
import { TaskFormData } from "@/schemas/task-schema";
import { CalendarYear } from "@/types/calendar";
import { Challenge, ChallengeEntry } from "@/types/challenges";
import { Task } from "@/types/tasks";

export interface ApiProvider {
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
  setTaskDone(
    id: string,
    done: boolean,
  ): Promise<{ task: Task; success: boolean }>;

  // challenges
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge>;
  getChallengeEntries(id: string): Promise<ChallengeEntry[]>;
  deleteChallenge(id: string): Promise<{ id: string; success: boolean }>;
  createChallenge(
    challenge: ChallengeFormData,
  ): Promise<{ challenge: Challenge; success: boolean }>;
  editChallenge(
    id: string,
    challenge: ChallengeFormData,
  ): Promise<{ challenge: Challenge; success: boolean }>;

  // id -> challenge, date -> date
  markChallengeDone(
    id: string,
    date: Date,
    done: boolean,
  ): Promise<{ success: boolean; entry: ChallengeEntry }>;
  markChallengeNotDone(id: string, date: Date): Promise<{ success: boolean }>;

  // auth
  // login(name: string, password: string): Promise<LoginResponse>;
  // signup(password: string, email: string, name: string): Promise<LoginResponse>;
  // logout(): Promise<{ success: boolean }>;
  // forgotPassword(email: string): Promise<{ success: boolean }>;
  // resetPassword(password: string, token: string): Promise<{ success: boolean }>;
  // verifyEmail(token: string): Promise<{ success: boolean }>;
  // resendVerificationEmail(email: string): Promise<{ success: boolean }>;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
