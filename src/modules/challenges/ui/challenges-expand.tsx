import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/8bit/dialog";
import { Challenge } from "@/types/challenges";
import { ExpandIcon } from "lucide-react";

interface ChallengesExpandProps {
  challenge?: Challenge;
}

const ChallengesExpand = ({ challenge }: ChallengesExpandProps) => {
  const disabled = !challenge;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} disabled={disabled}>
          <ExpandIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{challenge?.title}</DialogTitle>
          <DialogDescription className="text-xs">
            {challenge?.description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengesExpand;
