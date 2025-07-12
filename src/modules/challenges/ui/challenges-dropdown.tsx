import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import { Challenge } from "@/types/challenges";

interface ChallengesDropDownProps {
  challenges: Challenge[];
  currChallenge?: Challenge;
  setCurrChallenge: (id: string) => void;
}

const ChallengesDropDown = ({
  challenges,
  currChallenge,
  setCurrChallenge,
}: ChallengesDropDownProps) => {
  const noChallenges = challenges.length == 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={noChallenges}
          className="text-xs sm:text-sm md:text-md"
        >
          {!noChallenges ? currChallenge?.title : "no active challenges"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-xs sm:text-sm md:text-md w-56 rounded-none overflow-clip">
        {challenges.map((challenge) => (
          <DropdownMenuItem
            key={challenge.id}
            onSelect={() => setCurrChallenge(challenge.id)}
            className="text-xs sm:text-sm md:text-md xl:text-xl"
          >
            {challenge.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChallengesDropDown;
