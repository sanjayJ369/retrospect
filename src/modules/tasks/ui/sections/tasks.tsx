"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import TaskNew from "../components/task-new";
import { Separator } from "@/components/ui/8bit/separator";
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
    <Card className="min-h-full flex flex-col shadow-none border-none mx-3">
      <Container className="py-3">
        <CardHeader className="flex justify-center">
          <span className="w-full flex justify-between">
            <CardTitle className="font-bold text-2xl">T A S K S</CardTitle>
            <Separator orientation="vertical" />
            <TaskNew />
          </span>
        </CardHeader>
      </Container>

      <Container />
      <CardContent className="overflow-y-auto h-full flex-1">
        <ScrollArea className="w-full min-h-full">
          {tasks?.map((task) => (
            <div key={task.id} className="my-1 p-1">
              <TaskCard id={task.id} title={task.title} checked={task.done} />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <Container />
    </Card>
  );
};

export default Tasks;
