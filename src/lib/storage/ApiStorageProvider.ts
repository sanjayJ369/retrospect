import type { StorageProvider } from "./types";
import { StubStorageProvider } from "./stubStorageProvider";
import type { Task } from "@/types/tasks";
import type { TaskFormData } from "@/schemas/task-schema";
import type { CalendarYear } from "@/types/calendar";
import type { Challenge, ChallengeEntry } from "@/types/challenges";
import type { ChallengeFormData } from "@/schemas/challenge-schema";

function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  return base;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("retro.access_token");
}

function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const userStr = window.localStorage.getItem("retro.user");
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?.id || null;
  } catch {
    return null;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = getAccessToken();
  const headers: HeadersInit = {
    ...(init?.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    let detail: unknown = undefined;
    try {
      detail = await res.json();
    } catch {}
    throw new Error(`API error ${res.status}: ${JSON.stringify(detail)}`);
  }
  return (await res.json()) as T;
}

export const ApiStorageProvider: StorageProvider = {
  async getCalendarYear(year: number): Promise<CalendarYear | null> {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found");
    }
    const data = await apiFetch<CalendarYear>(
      `/users/${userId}/calendar/${year}`,
      {
        method: "GET",
      },
    );
    return data;
  },

  async getTask(id: string): Promise<Task | null> {
    const data = await apiFetch<Task>(`/tasks/${id}`, { method: "GET" });
    return data;
  },

  async deleteTask(id: string): Promise<{ id: string; success: boolean }> {
    await apiFetch(`/tasks/${id}`, { method: "DELETE" });
    return { id, success: true };
  },

  async editTask(id: string, newTask: TaskFormData) {
    const data = await apiFetch<Task>(`/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    return { task: data, success: true };
  },

  async createTask(task: TaskFormData) {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found");
    }
    const data = await apiFetch<Task>(`/users/${userId}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    return { task: data, success: true };
  },

  async getAllTasks(date: string) {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found");
    }
    const data = await apiFetch<Task[]>(`/users/${userId}/tasks?date=${date}`, {
      method: "GET",
    });
    return data;
  },

  async getAllChallenges(): Promise<Challenge[]> {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found");
    }
    const data = await apiFetch<Challenge[]>(`/users/${userId}/challenges`, {
      method: "GET",
    });
    return data;
  },

  async getChallenge(id: string): Promise<Challenge> {
    const data = await apiFetch<Challenge>(`/challenges/${id}`, {
      method: "GET",
    });
    return data;
  },

  async getChallengeEntries(id: string): Promise<ChallengeEntry[]> {
    const data = await apiFetch<ChallengeEntry[]>(
      `/challenges/${id}` as unknown as string,
      {
        method: "GET",
      },
    );
    // If backend exposes entries separately adapt here; fallback to stub otherwise
    if (!Array.isArray(data))
      return StubStorageProvider.getChallengeEntries(id);
    return data;
  },

  async deleteChallenge(id: string): Promise<{ id: string; success: boolean }> {
    await apiFetch<void>(`/challenges/${id}`, { method: "DELETE" });
    return { id, success: true };
  },

  async createChallenge(challenge: ChallengeFormData) {
    const payload = {
      name: challenge.title,
      description: challenge.description,
      start_date: challenge.startDate.toISOString().slice(0, 10),
      end_date: challenge.endDate.toISOString().slice(0, 10),
    };
    const created = await apiFetch<Challenge>(`/challenges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { challenge: created, success: true };
  },

  async editChallenge(id: string, challenge: ChallengeFormData) {
    const payload = {
      name: challenge.title,
      description: challenge.description,
      start_date: challenge.startDate.toISOString().slice(0, 10),
      end_date: challenge.endDate.toISOString().slice(0, 10),
    };
    const updated = await apiFetch<Challenge>(`/challenges/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { challenge: updated, success: true };
  },

  async markChallengeDone(id: string) {
    // Not exact endpoint; emulate via PUT challenge-entries if available
    try {
      await apiFetch(`/challenge-entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: true }),
      });
      return { success: true };
    } catch {
      return StubStorageProvider.markChallengeDone(id);
    }
  },

  async markChallengeNotDone(id: string) {
    try {
      await apiFetch(`/challenge-entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: false }),
      });
      return { success: true };
    } catch {
      return StubStorageProvider.markChallengeNotDone(id);
    }
  },

  async getAllChallengeEntries(challengeId: string) {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error("User ID not found");
    }
    const data = await apiFetch<ChallengeEntry[]>(
      `/users/${userId}/challenges/${challengeId}/entries`,
      {
        method: "GET",
      },
    );
    return data;
  },

  async setChallengeEntryDone(
    id: string,
    done: boolean,
  ): Promise<{ entry: ChallengeEntry; success: boolean }> {
    const data = await apiFetch<ChallengeEntry>(`/challenge-entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    return { entry: data, success: true };
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
