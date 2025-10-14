"use client";
import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import Container from "@/components/ui/8bit/container";
import { Calendar } from "@/components/ui/8bit/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/8bit/popover";
import { Button } from "@/components/ui/8bit/button";
import { ScrollArea } from "@/components/ui/scroll";
import { format, startOfDay, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useAllChallengesQuery } from "@/hooks/api/challenges/useAllChallengesQuery";
import { useAllChallengeEntriesQuery } from "@/hooks/api/challenges/useAllChallengeEntriesQuery";
import ChallengeHistoryEntry from "./challenge-history-entry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";

const ChallengeHistory = () => {
  // Initialize with yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [selectedDate, setSelectedDate] = useState<Date>(yesterday);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>("");

  const { data: challenges, isLoading: challengesLoading } =
    useAllChallengesQuery();
  const { data: entries, isLoading: entriesLoading } =
    useAllChallengeEntriesQuery(selectedChallengeId);

  // Get today's date at start of day for comparison
  const today = startOfDay(new Date());

  // Filter entries for the selected date
  const entriesForDate = entries?.filter((entry) =>
    isSameDay(entry.date, selectedDate),
  );

  // Get the selected challenge info
  const selectedChallenge = challenges?.find(
    (c) => c.id === selectedChallengeId,
  );

  // Set initial challenge when challenges load
  if (challenges && challenges.length > 0 && !selectedChallengeId) {
    setSelectedChallengeId(challenges[0].id);
  }

  return (
    <Container className="w-full flex flex-col shadow-none border-none my-4 items-center">
      <CardHeader className="w-full">
        <Container className="p-3 mb-3">
          <CardTitle
            className="font-bold text-xs sm:text-md md:text-xl flex items-center justify-between gap-2
              p-1"
          >
            <p>C H A L L E N G E &nbsp; H I S T O R Y</p>
          </CardTitle>
        </Container>
      </CardHeader>

      <CardContent className="h-full w-full space-y-4">
        {/* Challenge Selector */}
        {!challengesLoading && challenges && challenges.length > 0 && (
          <div className="w-full">
            <Select
              value={selectedChallengeId}
              onValueChange={setSelectedChallengeId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a challenge" />
              </SelectTrigger>
              <SelectContent>
                {challenges.map((challenge) => (
                  <SelectItem key={challenge.id} value={challenge.id}>
                    {challenge.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Date Picker */}
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date >= today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Loading State */}
        {(challengesLoading || entriesLoading) && (
          <p className="text-center">Loading...</p>
        )}

        {/* No Challenges */}
        {!challengesLoading && challenges && challenges.length === 0 && (
          <p className="text-center text-muted-foreground">
            No challenges found. Create a challenge to start tracking!
          </p>
        )}

        {/* Challenge Info and Entries */}
        {!challengesLoading &&
          !entriesLoading &&
          challenges &&
          challenges.length > 0 &&
          selectedChallenge && (
            <>
              {/* Challenge Date Range Info */}
              <div className="text-center text-sm text-muted-foreground p-2">
                <p className="font-semibold">{selectedChallenge.title}</p>
                <p className="text-xs">
                  {format(selectedChallenge.startDate, "MMM d, yyyy")} -{" "}
                  {selectedChallenge.endDate
                    ? format(selectedChallenge.endDate, "MMM d, yyyy")
                    : "Ongoing"}
                </p>
              </div>

              {/* Entries List */}
              {entriesForDate && entriesForDate.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No entry for this date.
                </p>
              )}

              {entriesForDate && entriesForDate.length > 0 && (
                <ScrollArea className="w-full min-h-full max-h-[400px]">
                  {entriesForDate.map((entry) => (
                    <div key={entry.id} className="my-1 p-1 w-full">
                      <ChallengeHistoryEntry
                        title={selectedChallenge.title}
                        completed={entry.completed}
                        date={entry.date}
                      />
                    </div>
                  ))}
                </ScrollArea>
              )}
            </>
          )}
      </CardContent>
    </Container>
  );
};

export default ChallengeHistory;
