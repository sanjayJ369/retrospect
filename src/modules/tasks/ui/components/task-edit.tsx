import { Alert } from "@/components/ui/8bit/alert";
import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/8bit/dialog";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/8bit/label";
import { Textarea } from "@/components/ui/8bit/textarea";
import { useTaskQuery } from "@/hooks/api/tasks/useTaskQuery";
import { SetStateAction, useEffect } from "react";

interface TaskEditProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  taskId: string;
}

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormData } from "@/schemas/task-schema";
import useEditTaskMutation from "@/hooks/api/tasks/useEditTaskMutation";

const TaskEdit = ({ open, setOpen, taskId }: TaskEditProps) => {
  const { data: task, isLoading, isError } = useTaskQuery(taskId);
  const { mutate } = useEditTaskMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        duration: task.duration,
      });
    }
  }, [task, reset]);

  if (isError) return <Alert>Error loading task</Alert>;
  if (isLoading || !task) return <p>Loading…</p>;

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    console.log("Submitted:", data);
    mutate({ id: task.id, task: data });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form className="contents" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription className="text-xs">
              Make changes to your Task here. Click save when done.
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} className="max-w-72" />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}

          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />

          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" type="number" {...register("duration")} />

          <DialogFooter>
            <Button size="sm" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEdit;
