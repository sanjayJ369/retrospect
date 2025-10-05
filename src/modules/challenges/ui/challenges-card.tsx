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

// Helper function to get the number of days in a given month and year
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

const ChallengesCard = () => {
  const today = new Date();

  // --- State Management ---
  const [challenge, setChallenge] = useState<Challenge | undefined>();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  // Single source of truth for the carousel's position
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  // --- Data Fetching ---
  const { data: challenges, isLoading, isError } = useAllChallengesQuery();
  const { data: entries } = useAllChallengeEntriesQuery(challenge?.id || "");

  // --- Logic & Effects ---

  // Effect to set the initial challenge from localStorage or default
  useEffect(() => {
    if (!challenges || challenges.length === 0) return;
    const savedChallengeId = localStorage.getItem("selectedChallengeId");
    const initialChallenge =
      challenges.find((c) => c.id === savedChallengeId) || challenges[0];
    setChallenge(initialChallenge);
    if (initialChallenge) {
      localStorage.setItem("selectedChallengeId", initialChallenge.id);
    }
  }, [challenges]);

  // The "Range Calculator" for the controls and carousel
  const { validYears, validMonths } = useMemo(() => {
    if (!challenge || !challenge.endDate) {
      const yearRange = [
        today.getFullYear() - 1,
        today.getFullYear(),
        today.getFullYear() + 1,
      ];
      const months = Array.from(
        { length: 12 },
        (_, i) => new Date(viewYear, i, 1),
      );
      return { validYears: yearRange, validMonths: months };
    }
    const start = challenge.startDate;
    const end = challenge.endDate;
    const years = new Set<number>();
    const months: Date[] = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      years.add(current.getFullYear());
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    return { validYears: Array.from(years), validMonths: months };
  }, [challenge, viewYear, today]);

  // The "Normalization Engine" to build the calendar grid data
  const normalizedMonths = useMemo<DayState[][]>(() => {
    if (!challenge || !entries) return validMonths.map(() => []);

    const entriesMap = new Map(
      entries.map((entry) => [entry.date.toISOString().slice(0, 10), entry]),
    );

    return validMonths.map((monthDate) => {
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
          date >= challenge.startDate &&
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
        monthDays.push({ date, status, isToday: isSameDay(date, today) });
      }
      return monthDays;
    });
  }, [challenge, entries, validMonths, today]);

  // Derived state: get the current global month from the carousel index
  const currentGlobalMonth = (
    validMonths[currentCarouselIndex] || today
  ).getMonth();

  // Effect to sync carousel UI with our state
  useEffect(() => {
    if (
      carouselApi &&
      carouselApi.selectedScrollSnap() !== currentCarouselIndex
    ) {
      carouselApi.scrollTo(currentCarouselIndex);
    }
  }, [carouselApi, currentCarouselIndex]);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      setCurrentCarouselIndex(carouselApi.selectedScrollSnap());
    };
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const handleSetChallenge = (id: string) => {
    const foundChallenge = challenges?.find((c) => c.id === id);
    if (foundChallenge) {
      setChallenge(foundChallenge);
      localStorage.setItem("selectedChallengeId", id);
      setViewYear(foundChallenge.startDate.getFullYear());
      setCurrentCarouselIndex(0);
    }
  };

  if (isLoading) return <ChallengesCardLoading />;
  if (isError) return <p>Error...</p>;

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
                setYear={setViewYear}
                year={viewYear}
                years={validYears}
              />
              <CalendarMonth
                setMonth={(monthIndex) => {
                  const targetIndex = validMonths.findIndex(
                    (date) =>
                      date.getMonth() === monthIndex &&
                      date.getFullYear() === viewYear,
                  );

                  if (targetIndex !== -1) {
                    setCurrentCarouselIndex(targetIndex);
                  }
                }}
                month={currentGlobalMonth}
                months={validMonths}
              />
            </div>
          </div>

          {/* --- DISPLAY --- */}
          <div className="w-full flex items-center justify-center">
            <Carousel
              opts={{
                startIndex: currentCarouselIndex,
                align: "start",
              }}
              setApi={setCarouselApi}
              className="h-full w-full md:w-4/5"
            >
              <CarouselContent className="h-full transition-transform duration-300 ease-in-out">
                {validMonths.map((date, index) => (
                  <CarouselItem key={date.toISOString()} className="h-full">
                    <div className="p-1 sm:p-2 md:p-3 h-full ml-2">
                      <ChallengeDaysCard days={normalizedMonths[index]} />
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
