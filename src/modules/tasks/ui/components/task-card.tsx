"use client";
import { Checkbox } from "@/components/ui/8bit/checkbox";
import Container from "@/components/ui/8bit/container";
import { cn } from "@/lib/utils";
import { useState } from "react";
import TaskDialog from "./task-dialog";
import TaskMutate from "./task-mutate";
import useEditTaskMutation from "@/hooks/api/tasks/useEditTaskMutation";
import { useTaskQuery } from "@/hooks/api/tasks/useTaskQuery";

interface TaskCardProps {
  id: string;
  title: string;
  checked: boolean;
}

const TaskCard = ({ id, title, checked }: TaskCardProps) => {
  const [done, setDone] = useState<boolean>(checked);
  const { data: task } = useTaskQuery(id);
  const { mutate: editTask } = useEditTaskMutation();

  const handleCheck = (checked: boolean) => {
    if (task) {
      editTask({ id, task: { ...task, done: checked } });
    }
    setDone(checked);
  };
  return (
    <Container
      className={cn(
        "flex gap-3 items-center p-3 justify-between flex-col sm:flex-row w-full",
        done ? "bg-screen" : "",
      )}
    >
      <Checkbox checked={done} onCheckedChange={handleCheck} />
      <div className="w-8/10 flex-1 text-sx sm:text-sm md:text-md xl:text-xl">
        <TaskDialog title={title} id={id} />
      </div>
      <TaskMutate id={id} />
    </Container>
  );
};

export default TaskCard;
