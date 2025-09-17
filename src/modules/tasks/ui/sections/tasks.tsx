"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import TaskNew from "../components/task-new";
import Container from "@/components/ui/8bit/container";
import { useAllTaskQuery } from "@/hooks/api/tasks/useAllTasksQuery";
import TaskCard from "../components/task-card";
import { ScrollArea } from "@/components/ui/scroll";

const Tasks = () => {
  const date = Date.now().toString();
  const { data: tasks, isLoading, isError } = useAllTaskQuery(date);
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error!</p>;
  }

  return (
    <Container className="w-full flex flex-col shadow-none border-none my-4 items-center">
      <CardHeader className="w-full">
        <Container className="p-3">
          <CardTitle
            className="font-bold text-xs sm:text-md md:text-xl flex items-center justify-between gap-2
              p-1"
          >
            <p>T A S K S </p>
            <TaskNew />
          </CardTitle>
        </Container>
      </CardHeader>

      <CardContent className="h-full w-full">
        <ScrollArea className="w-full min-h-full">
          {tasks?.map((task) => (
            <div key={task.id} className="my-1 p-1 w-full">
              <TaskCard id={task.id} title={task.title} checked={task.done} />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Container>
  );
};

export default Tasks;
