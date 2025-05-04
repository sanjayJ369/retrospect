import Calendar from "@/modules/calendar/ui/components/calendar";
import DateDisplay from "@/modules/date/ui/components/date-display";
import Tasks from "@/modules/tasks/ui/sections/tasks";

const HomeView = () => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-2 p-3 h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col gap-2 h-full">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-2 h-1/2 md:h-full lg:h-1/2">
          <div className="md:col-span-3 lg:col-span-2 h-full overflow-auto px-3">
            <Calendar />
          </div>
          <div className="hidden lg:flex h-full items-start justify-center">
            <DateDisplay />
          </div>

          {/* Date display for mobile/tablet - shown between calendar and challenges */}
          <div className="flex lg:hidden h-36 md:h-48 items-center justify-center my-2">
            <DateDisplay />
          </div>
        </div>

        <div className="overflow-auto h-1/2 md:h-full lg:h-1/2">
          <p>challenges</p>
        </div>
      </div>

      <div className="h-full overflow-auto mt-4 lg:mt-0">
        <Tasks />
      </div>
    </div>
  );
};

export default HomeView;
