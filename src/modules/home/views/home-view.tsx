import Calendar from "@/modules/calendar/ui/components/calendar";
import DateDisplay from "@/modules/date/ui/components/date-display";
import Tasks from "@/modules/tasks/ui/sections/tasks";

const HomeView = () => {
  return (
    <div className="flex h-full p-3">
      <div className="flex justify-between w-1/2 gap-2">
        <div className="w-2/3">
          <Calendar />
        </div>
        <div className="w-1/3 flex items-start justify-center">
          <DateDisplay />
        </div>
      </div>

      <div className="w-1/2">
        <Tasks />
      </div>
    </div>
  );
};

export default HomeView;
