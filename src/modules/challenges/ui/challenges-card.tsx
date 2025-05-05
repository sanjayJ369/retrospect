"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/8bit/card";
import { CardTitle } from "@/components/ui/card";
import ChallengesDropDown from "./challenges-dropdown";
import { useEffect, useState } from "react";
import { useAllChallengesQuery } from "@/hooks/api/challenges/useAllChallengesQuery";
import { Challenge, ChallengeEntry } from "@/types/challenges";
import ChallengesExpand from "./challenges-expand";
import ChallengeDaysCard from "./challenges-days-card";
import { useAllChallengeEntriesQuery } from "@/hooks/api/challenges/useAllChallengeEntriesQuery";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
import Container from "@/components/ui/8bit/container";

const ChallengesCard = () => {
  const [challenge, setChallenge] = useState<Challenge>();
  const { data: challenges, isLoading, isError } = useAllChallengesQuery();
  const { data: days } = useAllChallengeEntriesQuery(challenge?.id || "");
  const today = new Date();

  useEffect(() => {
    const savedChallengeId = localStorage.getItem("selectedChallengeId");
    if (savedChallengeId == null && challenges && challenges.length > 0) {
      setChallenge(challenges[0]);
      localStorage.setItem("selectedChallengeId", challenges[0].id);
    } else if (savedChallengeId && challenges) {
      const foundChallenge = challenges.find((c) => c.id === savedChallengeId);
      if (foundChallenge) {
        setChallenge(foundChallenge);
      }
    }
  }, [challenges]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error...</p>;
  }

  const handleSetChallenge = (id: string) => {
    const foundChallenge = challenges?.find((c) => c.id === id);
    if (foundChallenge) {
      setChallenge(foundChallenge);
      localStorage.setItem("selectedChallengeId", id);
    }
  };

  const daysInMonths: Map<number, ChallengeEntry[]> = new Map();
  days?.forEach((day) => {
    const entries = daysInMonths.get(day.date.getMonth()) || [];
    daysInMonths.set(day.date.getMonth(), [...entries, day]);
  });

  return (
    <Container className="px-3 py-1">
      <div className="h-full overflow-hidden flex flex-col my-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-2">
          <p className="font-bold text-sm sm:text-lg md:text-xl">Challenges.</p>
          <div>
            <ChallengesDropDown
              challenges={challenges!}
              currChallenge={challenge}
              setCurrChallenge={handleSetChallenge}
            />
            <span className="px-4">
              <ChallengesExpand challenge={challenge} />
            </span>
          </div>
        </div>
        <div className="p-0 sm:p-2 flex-1 overflow-hidden">
          <div className="w-full h-4/5 flex items-center justify-center">
            <Carousel
              opts={{
                startIndex: today.getMonth(),
              }}
              className="h-full w-10/12"
            >
              <CarouselContent className="h-full">
                {Array.from(daysInMonths.entries()).map(([month, entries]) => (
                  <CarouselItem key={month} className="h-full">
                    <div className="p-1 sm:p-2 h-full overflow-auto">
                      <ChallengeDaysCard days={entries} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ChallengesCard;
