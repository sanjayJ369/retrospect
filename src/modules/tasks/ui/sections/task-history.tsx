"use client";
import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import Container from "@/components/ui/8bit/container";
import { Calendar } from "@/components/ui/8bit/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/8bit/popover";
import { Button } from "@/components/ui/8bit/button";
import { useAllTaskQuery } from "@/hooks/api/tasks/useAllTasksQuery";
import TaskHistoryCard from "../components/task-history-card";
import { ScrollArea } from "@/components/ui/scroll";
import { format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

const TaskHistory = () => {
  // Initialize with yesterday's date to avoid showing today's tasks by default
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const [selectedDate, setSelectedDate] = useState<Date>(yesterday);
  const dateString = format(selectedDate, "yyyy-MM-dd");

  const { data: tasks, isLoading, isError } = useAllTaskQuery(dateString);

  // Get today's date at start of day for comparison
  const today = startOfDay(new Date());

  return (
    <Container className="w-full flex flex-col shadow-none border-none my-4 items-center">
      <CardHeader className="w-full">
        <Container className="p-3 mb-3 flex items-center justify-center">
          <CardTitle
            className="flex items-center justify-center w-full font-bold text-xs sm:text-md md:text-xl
              gap-2 p-1"
          >
            <p>T A S K &nbsp; H I S T O R Y</p>
          </CardTitle>
        </Container>
      </CardHeader>

      <CardContent className="h-full w-full p-3">
        <div className="mb-4 flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={(date) => date >= today}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {isLoading && <p className="text-center">Loading...</p>}

        {isError && (
          <p className="text-center text-red-500">Error loading tasks!</p>
        )}

        {!isLoading && !isError && tasks && tasks.length === 0 && (
          <p className="text-center text-muted-foreground">
            No tasks found for this date.
          </p>
        )}

        {!isLoading && !isError && tasks && tasks.length > 0 && (
          <ScrollArea className="w-full min-h-full max-h-[400px]">
            {tasks.map((task) => (
              <div key={task.id} className="my-1 p-1 w-full">
                <TaskHistoryCard title={task.title} checked={task.done} />
              </div>
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Container>
  );
};

export default TaskHistory;
