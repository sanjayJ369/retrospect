import ChallengesCard from "@/modules/challenges/ui/challenges-card";
import ChallengeHistory from "@/modules/challenges/ui/challenge-history";
import React from "react";

const ChallengesPage = () => {
  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-start justify-center gap-4 p-4">
      <div className="w-full lg:w-3/5">
        <ChallengesCard />
      </div>
      <div className="w-full lg:w-2/5">
        <ChallengeHistory />
      </div>
    </div>
  );
};

export default ChallengesPage;
