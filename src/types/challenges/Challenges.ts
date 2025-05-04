export interface ChallengeEntry {
  id: string; // uuid
  challengeId: string; // uuid
  date: Date;
  completed: boolean;
}

export interface Challenge {
  id: string; // uuid
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
}
