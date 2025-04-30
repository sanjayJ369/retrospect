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
    <Card className="max-h-[calc(100vh-7rem)]">
      <Container className="py-3 mx-4">
        <CardHeader className="flex justify-center">
          <span className="w-full flex justify-between">
            <CardTitle className="font-bold text-2xl">T A S K S</CardTitle>
            <Separator orientation="vertical" />
            <TaskNew />
          </span>
        </CardHeader>
      </Container>

      <CardContent className="overflow-y-auto">
        {tasks?.map((task) => (
          <div key={task.id} className="my-1">
            <TaskCard id={task.id} title={task.title} checked={task.done} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Tasks;
