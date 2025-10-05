// src/types/tasks.ts
export interface Task {
  id: string;
  date: Date | undefined;
  done: boolean;
  title: string;
  description: string;
  duration: number;
}
