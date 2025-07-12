import Calendar from "@/modules/calendar/ui/components/calendar";
import ChallengesCard from "@/modules/challenges/ui/challenges-card";
import DateDisplay from "@/modules/date/ui/components/date-display";
import Tasks from "@/modules/tasks/ui/sections/tasks";

const HomeView = () => {
  return (
    <div className="">
      <Calendar />

      {/* <ChallengesCard /> */}
      <DateDisplay />

      {/* <Tasks />  */}
    </div>
  );
};

export default HomeView;
