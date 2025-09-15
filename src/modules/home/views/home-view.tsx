import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import DateDisplay from "@/modules/date/ui/components/date-display";

const Calendar = dynamic(
  () => import("@/modules/calendar/ui/components/calendar"),
  {
    loading: () => <Skeleton className="h-64 w-full" />,
  },
);

const ChallengesCard = dynamic(
  () => import("@/modules/challenges/ui/challenges-card"),
  {
    loading: () => <Skeleton className="h-48 w-full" />,
  },
);

const Tasks = dynamic(() => import("@/modules/tasks/ui/sections/tasks"), {
  loading: () => <Skeleton className="h-96 w-full" />,
});

const HomeView = () => {
  return (
    <div className="p-4">
      <div className="block lg:hidden">
        <Calendar />
        <ChallengesCard />
        <div className="flex items-center justify-center">
          <DateDisplay />
        </div>
        <div className="flex items-center justify-center">
          <div className="w-4/5">
            <Tasks />
          </div>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-2">
        <div>
          <Calendar />
          <ChallengesCard />
        </div>
        <div className="flex justify-center">
          <div className="w-4/5">
            <Tasks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
