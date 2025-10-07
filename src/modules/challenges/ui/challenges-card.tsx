"use client";
import { useEffect, useMemo, useState } from "react";
import { useAllChallengesQuery } from "@/hooks/api/challenges/useAllChallengesQuery";
import { Challenge } from "@/types/challenges";
import { useAllChallengeEntriesQuery } from "@/hooks/api/challenges/useAllChallengeEntriesQuery";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
import Container from "@/components/ui/8bit/container";
import ChallengesCardLoading from "./challenges-card-loading";
import ChallengeNew from "../challenge-new";
import ChallengesDropDown from "./challenges-dropdown";
import ChallengesExpand from "./challenges-expand";
import ChallengeDaysCard, { DayState } from "./challenges-days-card";
import { isSameDay, isFuture } from "date-fns";
import CalendarYear from "@/modules/calendar/ui/components/calendar-year";
import CalendarMonth from "@/modules/calendar/ui/components/calendar-month";
import useChallengeEntryDoneToggleMutation from "@/hooks/api/challenges/useChallengeEntryDoneMutation";

// Helper function to get the number of days in a given month and year
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getYearRange(start: Date, end: Date): number[] {
  const years = [];
  for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
    years.push(y);
  }
  return years;
}

function getValidMonthsForYear(year: number, start: Date, end: Date): Date[] {
  const startMonth = year === start.getFullYear() ? start.getMonth() : 0;
  const endMonth = year === end.getFullYear() ? end.getMonth() : 11;
  const months: Date[] = [];
  for (let i = startMonth; i <= endMonth; i++) {
    months.push(new Date(year, i, 1));
  }
  return months;
}

const ChallengesCard = () => {
  const today = new Date();
  const [challenge, setChallenge] = useState<Challenge | undefined>();
  const [viewDate, setViewDate] = useState(new Date()); // Single source of truth for the view
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const { data: challenges, isLoading, isError } = useAllChallengesQuery();
  const { data: entries } = useAllChallengeEntriesQuery(challenge?.id || "");
  const { mutate: toggleDay, isPending } =
    useChallengeEntryDoneToggleMutation();

  // Effect to set the initial challenge
  useEffect(() => {
    if (!challenges || challenges.length === 0) return;
    const savedChallengeId = localStorage.getItem("selectedChallengeId");
    const initialChallenge =
      challenges.find((c) => c.id === savedChallengeId) || challenges[0];
    if (initialChallenge) {
      setChallenge(initialChallenge);
      setViewDate(
        initialChallenge.startDate > today ? initialChallenge.startDate : today,
      );
      localStorage.setItem("selectedChallengeId", initialChallenge.id);
    }
  }, [challenges]);

  // The "Range Calculator"
  const { validYears, validMonthsForViewYear } = useMemo(() => {
    if (!challenge)
      return { validYears: [today.getFullYear()], validMonthsForViewYear: [] };

    if (!challenge.endDate) {
      // Limitless challenge
      const yearRange = [
        today.getFullYear() - 1,
        today.getFullYear(),
        today.getFullYear() + 1,
      ];
      const months = Array.from(
        { length: 12 },
        (_, i) => new Date(viewDate.getFullYear(), i, 1),
      );
      return { validYears: yearRange, validMonthsForViewYear: months };
    }

    // Finite challenge
    const years = getYearRange(challenge.startDate, challenge.endDate);
    // ✅ THE FIX: Use the state `viewDate.getFullYear()` instead of a hardcoded year
    const months = getValidMonthsForYear(
      viewDate.getFullYear(),
      challenge.startDate,
      challenge.endDate,
    );
    return { validYears: years, validMonthsForViewYear: months };
  }, [challenge, viewDate, today]);

  // The "Normalization Engine" to build the calendar grid data
  const normalizedMonths = useMemo<DayState[][]>(() => {
    if (!challenge || !entries) return validMonthsForViewYear.map(() => []);

    const entriesMap = new Map(
      entries.map((entry) => [entry.date.toISOString().slice(0, 10), entry]),
    );

    return validMonthsForViewYear.map((monthDate) => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const monthDays: DayState[] = [];

      for (let dayIndex = 1; dayIndex <= daysInMonth; dayIndex++) {
        const date = new Date(year, month, dayIndex);
        const dateString = date.toISOString().slice(0, 10);
        const entry = entriesMap.get(dateString);

        let status: DayState["status"] = "disabled";
        const isWithinRange =
          (date >= challenge.startDate ||
            isSameDay(date, challenge.startDate)) &&
          (!challenge.endDate || date <= challenge.endDate);

        if (isWithinRange) {
          if (entry) {
            status = entry.completed ? "completed" : "not-completed";
          } else {
            status =
              isFuture(date) && !isSameDay(date, today)
                ? "future"
                : "not-completed";
          }
        }
        monthDays.push({
          date,
          status,
          isToday: isSameDay(date, today),
          id: entry?.id,
        });
      }
      return monthDays;
    });
  }, [challenge, entries, validMonthsForViewYear, today]);
  const handleToggleDay = (date: Date, completed: boolean) => {
    if (!challenge) return;
    toggleDay({ id: challenge.id, date, done: completed });
  };

  const handleSetChallenge = (id: string) => {
    const foundChallenge = challenges?.find((c) => c.id === id);
    if (foundChallenge) {
      setChallenge(foundChallenge);
      localStorage.setItem("selectedChallengeId", id);
      setViewDate(foundChallenge.startDate); // Jump view to the start of the new challenge
    }
  };

  useEffect(() => {
    if (!carouselApi) return;
    // Sync our state when the user swipes the carousel
    const onSelect = () => {
      const selectedIndex = carouselApi.selectedScrollSnap();
      const newSelectedMonth = validMonthsForViewYear[selectedIndex];
      if (newSelectedMonth) {
        // Update viewDate without triggering an unnecessary scroll
        setViewDate((current) => {
          const newDate = new Date(current);
          newDate.setFullYear(newSelectedMonth.getFullYear());
          newDate.setMonth(newSelectedMonth.getMonth());
          return newDate;
        });
      }
    };
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, validMonthsForViewYear]);

  // --- Render Logic ---
  if (isLoading) return <ChallengesCardLoading />;
  if (isError) return <p>Error...</p>;

  // Calculate the carousel start index dynamically
  const startIndex = validMonthsForViewYear.findIndex(
    (m) => m.getMonth() === viewDate.getMonth(),
  );

  return (
    <div className="w-full flex items-center justify-center my-4">
      <Container className="w-4/5 p-1 flex flex-col items-center justify-center">
        <div className="w-full h-full overflow-hidden flex flex-col my-1">
          {/* --- CONTROLS --- */}
          <div className="w-full p-3 my-1">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-sm sm:text-lg md:text-xl">
                Challenges
              </p>
              <ChallengeNew />
            </div>
            <div className="flex justify-between items-center mb-4">
              <ChallengesDropDown
                challenges={challenges || []}
                currChallenge={challenge}
                setCurrChallenge={handleSetChallenge}
              />
              <ChallengesExpand challenge={challenge} />
            </div>
            <div className="w-full py-3 flex items-center justify-between">
              <CalendarYear
                setYear={(year) => {
                  if (!challenge) return;
                  const firstValidMonth = getValidMonthsForYear(
                    year,
                    challenge.startDate,
                    challenge.endDate || new Date(year, 11, 31),
                  ).at(0);
                  if (firstValidMonth) {
                    setViewDate(new Date(year, firstValidMonth.getMonth(), 1));
                  }
                }}
                year={viewDate.getFullYear()}
                years={validYears}
              />
              <CalendarMonth
                setMonth={(monthIndex) =>
                  setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1))
                }
                month={viewDate.getMonth()}
                months={validMonthsForViewYear}
              />
            </div>
          </div>

          {/* --- DISPLAY --- */}
          <div className="w-full flex items-center justify-center">
            <Carousel
              key={challenge?.id}
              opts={{
                startIndex: startIndex > -1 ? startIndex : 0,
                align: "start",
              }}
              setApi={setCarouselApi}
              className="h-full w-full md:w-4/5"
            >
              <CarouselContent className="h-full transition-transform duration-300 ease-in-out">
                {validMonthsForViewYear.map((date, index) => (
                  <CarouselItem key={date.toISOString()} className="h-full">
                    <div className="p-1 sm:p-2 md:p-3 h-full ml-2">
                      <ChallengeDaysCard
                        days={normalizedMonths[index]}
                        onToggleDay={handleToggleDay}
                        isMutating={isPending}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:block m-2" />
              <CarouselNext className="hidden sm:block m-2" />
            </Carousel>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ChallengesCard;
