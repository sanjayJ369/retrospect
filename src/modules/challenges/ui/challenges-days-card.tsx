import { Card } from "@/components/ui/8bit/card";
import Container from "@/components/ui/8bit/container";
import { cn } from "@/lib/utils";
import { ChallengeEntry } from "@/types/challenges";

interface ChallengeDaysCard {
  days?: ChallengeEntry[];
}

const ChallengeDaysCard = ({ days }: ChallengeDaysCard) => {
  return (
    <Card className={cn("w-full h-full p-1")}>
      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1 sm:gap-2
          md:gap-3 p-1 sm:p-2 md:p-3 h-full"
      >
        {days?.map((day) => (
          <Container
            key={day.id}
            className={
              "rounded p-1 sm:p-2 text-center text-xs sm:text-sm md:text-base"
            }
            style={{
              backgroundColor: `rgba(120, 255, 120, ${day.completed ? 1 : 0})`,
            }}
          >
            {day.date.getDate()}
          </Container>
        ))}
      </div>
    </Card>
  );
};

export default ChallengeDaysCard;
