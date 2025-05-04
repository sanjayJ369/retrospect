"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/8bit/card";
import { CardTitle } from "@/components/ui/card";
import ChallengesDropDown from "./challenges-dropdown";
import { useEffect, useState } from "react";
import { useAllChallengesQuery } from "@/hooks/api/challenges/useAllChallengesQuery";
import { Challenge } from "@/types/challenges";
import ChallengesExpand from "./challenges-expand";

const ChallengesCard = () => {
  const [challenge, setChallenge] = useState<Challenge>();
  const { data: challenges, isLoading, isError } = useAllChallengesQuery();

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

  return (
    <Card className="m-3 bg-transparent border-none shadow-none max-h-full">
      <CardHeader>
        <CardTitle>
          <p className="font-bold text-3xl">Challenges</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <ChallengesDropDown
            challenges={challenges!}
            currChallenge={challenge}
            setCurrChallenge={handleSetChallenge}
          />
          <ChallengesExpand challenge={challenge} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengesCard;
