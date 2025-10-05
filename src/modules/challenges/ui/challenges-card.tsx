"use client";
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
import ChallengesCardLoading from "./challenges-card-loading";
import ChallengeNew from "../challenge-new";

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
    return <ChallengesCardLoading />;
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
    <div className="w-full flex items-center justify-center my-4">
      <Container className="w-4/5 p-1 flex flex-col items-center justify-center">
        <div className="w-full h-full overflow-hidden flex flex-col my-1">
          <div className="w-full p-3 my-1">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-sm sm:text-lg md:text-xl">
                Challenges
              </p>
              <ChallengeNew />
            </div>

            <div className="flex justify-between items-center">
              <ChallengesDropDown
                challenges={challenges!}
                currChallenge={challenge}
                setCurrChallenge={handleSetChallenge}
              />
              <ChallengesExpand challenge={challenge} />
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <Carousel
              opts={{
                startIndex: today.getMonth(),
              }}
              className="h-full w-full md:w-4/5"
            >
              <CarouselContent className="h-full">
                {Array.from(daysInMonths.entries()).map(([month, entries]) => (
                  <CarouselItem key={month} className="h-full">
                    <div className="p-1 sm:p-2 md:p-3 h-full">
                      <ChallengeDaysCard days={entries} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {daysInMonths.size > 0 && (
                <CarouselPrevious className="hidden sm:block m-2" />
              )}
              {daysInMonths.size > 0 && (
                <CarouselNext className="hidden sm:block m-2" />
              )}
            </Carousel>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ChallengesCard;
