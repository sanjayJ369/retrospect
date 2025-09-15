import Dexie, { type Table } from "dexie";
import type { Task } from "@/types/tasks";
import type { Challenge, ChallengeEntry } from "@/types/challenges";

export class RetrospectDB extends Dexie {
  tasks!: Table<Task>;
  challenges!: Table<Challenge>;
  challengeEntries!: Table<ChallengeEntry>;

  constructor() {
    super("retrospect");
    this.version(1).stores({
      tasks: "++id, done, title, description, duration",
      challenges: "++id, title, description, duration, startDate, endDate",
      challengeEntries: "++id, challengeId, date, done",
    });
  }
}

export const db = new RetrospectDB();
