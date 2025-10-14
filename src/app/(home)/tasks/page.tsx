import Tasks from "@/modules/tasks/ui/sections/tasks";
import TaskHistory from "@/modules/tasks/ui/sections/task-history";
import React from "react";

const TasksPage = () => {
  return (
    <div className="m-4 flex flex-col lg:flex-row items-start justify-center gap-4">
      <div className="w-full lg:w-1/2">
        <Tasks />
      </div>
      <div className="w-full lg:w-1/2">
        <TaskHistory />
      </div>
    </div>
  );
};

export default TasksPage;
