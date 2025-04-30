"use client";
import { PlusIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/8bit/sheet";
import { Button } from "@/components/ui/8bit/button";
import { Label } from "@/components/ui/8bit/label";
import { Input } from "@/components/ui/8bit/input";
import { Textarea } from "@/components/ui/8bit/textarea";
import useCreateTaskMutation from "@/hooks/api/tasks/useCreateTaskMutation";
import { SubmitHandler, useForm } from "react-hook-form";
import { TaskFormData, taskSchema } from "@/schemas/task-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const TaskNew = () => {
  const { mutate } = useCreateTaskMutation();
  const [open, setOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 45,
    },
  });

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    console.log("create new task:", data);
    mutate(data);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" aria-label="Add task">
          <PlusIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-col p-5"
        >
          <SheetHeader>
            <SheetTitle>Add New Task</SheetTitle>
            <SheetDescription className="text-xs">
              Fill out the fields below to create your task.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-4 pt-4">
            <div className="grid gap-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g. Buy groceries"
              />
              {errors.title && (
                <p className="text-xs">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="More details (optional)"
                rows={3}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration")}
                placeholder="0"
              />
              {errors.duration && (
                <p className="text-xs">{errors.duration.message}</p>
              )}
            </div>
          </div>

          <SheetFooter className="pt-4">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Task"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default TaskNew;
