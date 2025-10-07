import { db } from "./db";
import { startOfDay, addDays } from "date-fns";
import { ChallengeEntry } from "@/types/challenges";

export async function seedDailyData() {
  console.log("Running daily data seeder...");
  const today = startOfDay(new Date());

  const activeChallenges = await db.challenges
    .filter((challenge) => {
      const startDate = startOfDay(challenge.startDate);
      const endDate = challenge.endDate ? startOfDay(challenge.endDate) : null;

      if (endDate) {
        return today >= startDate && today <= endDate;
      }
      return today >= startDate;
    })
    .toArray();

  if (activeChallenges.length === 0) {
    console.log("No active challenges to seed.");
    return;
  }

  const dateRange = [today, addDays(today, 1), addDays(today, 2)];
  const entriesToAdd: Omit<ChallengeEntry, "id">[] = [];

  await db.transaction("rw", db.challengeEntries, async () => {
    for (const challenge of activeChallenges) {
      for (const date of dateRange) {
        // Your `&[challengeId+date]` compound index is perfect for this!
        // It makes this check very fast.
        const existingEntryCount = await db.challengeEntries
          .where("[challengeId+date]")
          .equals([challenge.id, date])
          .count();

        // If no entry exists for this challenge on this day, prepare to add one.
        if (existingEntryCount === 0) {
          entriesToAdd.push({
            challengeId: challenge.id,
            date: date,
            completed: false,
          });
        }
      }
    }

    if (entriesToAdd.length > 0) {
      // Use bulkAdd for efficiency. It's much faster than many individual `add` calls.
      await db.challengeEntries.bulkAdd(entriesToAdd as ChallengeEntry[]);
      console.log(`Seeded ${entriesToAdd.length} new challenge entries.`);
    } else {
      console.log("All challenge entries for the next 3 days already exist.");
    }
  });
}
