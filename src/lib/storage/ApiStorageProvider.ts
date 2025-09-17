import type { LoginResponse, StorageProvider } from "./types";

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
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
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

  async setTaskDone(
    id: string,
    done: boolean,
  ): Promise<{ task: Task; success: boolean }> {
    const data = await apiFetch<Task>(`/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
    return { task: data, success: true };
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

  async getChallengeEntries(challengeId: string): Promise<ChallengeEntry[]> {
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
    return data.map((entry) => ({
      ...entry,
      date: new Date(entry.date),
    }));
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

  async markChallengeDone(id: string, date: Date, done: boolean) {
    const entries = await this.getChallengeEntries(id);
    const entry = entries.find(
      (e) =>
        e.date.toISOString().slice(0, 10) === date.toISOString().slice(0, 10),
    );

    if (!entry) {
      // This case should ideally not happen in the UI
      throw new Error("Challenge entry not found for the given date.");
    }

    const updatedEntry = await apiFetch<ChallengeEntry>(
      `/challenge-entries/${entry.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_completed: done }),
      },
    );

    return { success: true, entry: updatedEntry };
  },

  async markChallengeNotDone(id: string, date: Date) {
    const entries = await this.getChallengeEntries(id);
    const entry = entries.find(
      (e) =>
        e.date.toISOString().slice(0, 10) === date.toISOString().slice(0, 10),
    );

    if (!entry) {
      // This case should ideally not happen in the UI
      throw new Error("Challenge entry not found for the given date.");
    }

    await apiFetch(`/challenge-entries/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed: false }),
    });

    return { success: true };
  },

  async login(name: string, password: string): Promise<LoginResponse> {
    const data = await apiFetch<LoginResponse>("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });
    return data;
  },
  async signup(
    password: string,
    email: string,
    name: string,
  ): Promise<LoginResponse> {
    await apiFetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    // After signup, login to get tokens
    const data = await apiFetch<LoginResponse>("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    return data;
  },
  async logout(): Promise<{ success: boolean }> {
    // Logout is handled client-side by clearing tokens
    return { success: true };
  },
  async forgotPassword(email: string): Promise<{ success: boolean }> {
    await apiFetch("/users/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return { success: true };
  },
  async resetPassword(
    password: string,
    token: string,
  ): Promise<{ success: boolean }> {
    await apiFetch("/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_password: password, token }),
    });
    return { success: true };
  },
  async verifyEmail(token: string): Promise<{ success: boolean }> {
    await apiFetch("/users/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return { success: true };
  },
  async resendVerificationEmail(email: string): Promise<{ success: boolean }> {
    await apiFetch("/users/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return { success: true };
  },
};
