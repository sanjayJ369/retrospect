import Calendar from "@/modules/calendar/ui/components/calendar";
import ChallengesCard from "@/modules/challenges/ui/challenges-card";
import DateDisplay from "@/modules/date/ui/components/date-display";
import Tasks from "@/modules/tasks/ui/sections/tasks";

const HomeView = () => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 p-4 h-[calc(100vh-3.5rem)]">
      {/* Left column */}
      <div className="flex flex-col gap-1 h-full">
        {/* Calendar and DateDisplay section */}
        <div className="grid grid-cols-3 gap-1 h-1/2">
          <div className="col-span-2 h-full">
            <Calendar />
          </div>
          <div className="col-span-1 h-full flex items-center justify-center">
            <DateDisplay />
          </div>
        </div>

        {/* Challenges section */}
        <div className="h-1/2">
          <ChallengesCard />
        </div>
      </div>

      {/* Right column - Tasks */}
      <div className="h-full">
        <Tasks />
      </div>
    </div>
  );
};

export default HomeView;
