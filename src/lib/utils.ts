import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateRange(start: Date, end: Date): Date[] {
  const result: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    result.push(new Date(current)); // Push a copy of current
    current.setDate(current.getDate() + 1); // Move to next day
  }

  return result;
}
