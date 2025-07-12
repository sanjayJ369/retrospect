import Calendar from "@/modules/calendar/ui/components/calendar";
import ChallengesCard from "@/modules/challenges/ui/challenges-card";
import DateDisplay from "@/modules/date/ui/components/date-display";
import Tasks from "@/modules/tasks/ui/sections/tasks";

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
