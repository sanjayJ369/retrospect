import Dexie, { type Table } from "dexie";
import type { Task } from "@/types/tasks";
import type { Challenge, ChallengeEntry } from "@/types/challenges";

export class RetrospectDB extends Dexie {
  tasks!: Table<Task>;
  challenges!: Table<Challenge>;
  challengeEntries!: Table<ChallengeEntry>;

  constructor() {
    super("retrospect");
    this.version(2).stores({
      tasks: "++id, date, done, title",
      challenges: "++id, title, startDate, endDate",
      challengeEntries: "++id, &[challengeId+date], challengeId",
    });
  }
}

export const db = new RetrospectDB();
