import Calendar from "@/modules/calendar/ui/components/calendar";
import DateDisplay from "@/modules/date/ui/components/date-display";

const HomeView = () => {
  return (
    <div>
      <div className="flex p-3">
        <span className="flex-2">
          <Calendar />
        </span>
        <span className="flex-1">
          <DateDisplay />
        </span>
      </div>
    </div>
  );
};

export default HomeView;
