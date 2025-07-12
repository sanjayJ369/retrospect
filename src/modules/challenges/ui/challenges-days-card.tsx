import { Card } from "@/components/ui/8bit/card";
import Container from "@/components/ui/8bit/container";
import { cn } from "@/lib/utils";
import { ChallengeEntry } from "@/types/challenges";

interface ChallengeDaysCard {
  days?: ChallengeEntry[];
}

const ChallengeDaysCard = ({ days }: ChallengeDaysCard) => {
  return (
    <Card className={cn("w-full h-full")}>
      <div className="grid grid-cols-7 gap-1 px-4">
        {days?.map((day) => (
          <div key={day.id} className="flex items-center justify-center">
            <Container
              className={"p-3 flex-0 w-4 h-4 sm:w-auto sm:h-auto"}
              style={{
                backgroundColor: `rgba(120, 255, 120, ${day.completed ? 1 : 0})`,
              }}
            >
              <span className="hidden sm:block w-8 h-8 md:w-12 lg:w-18 text-center">
                {day.date.getDate()}
              </span>
              <div className="block sm:hidden w-2 h-2"></div>
            </Container>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ChallengeDaysCard;
