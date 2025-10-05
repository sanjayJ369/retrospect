"use client";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/8bit/calendar";
import { addDays, differenceInDays, format, startOfDay } from "date-fns";
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/8bit/popover";
import { Checkbox } from "@/components/ui/8bit/checkbox";
import useCreateChallengeMutation from "@/hooks/api/challenges/useCreateChallengeMutation";
import { ChallengeFormData, challengeSchema } from "@/schemas/challenge-schema";

const ChallengeNew = () => {
  const { mutate } = useCreateChallengeMutation();
  const [open, setOpen] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: undefined,
      isLimitless: false,
      duration: undefined,
    },
  });

  // Watch the 'isLimitless' field to disable/enable other inputs
  const isLimitless = watch("isLimitless");

  // Handler for when the duration (number) input changes
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const duration = parseInt(e.target.value, 10);
    if (!isNaN(duration) && duration > 0) {
      const newEndDate = addDays(startOfDay(new Date()), duration - 1);
      setValue("endDate", newEndDate, { shouldValidate: true });
    } else {
      setValue("endDate", undefined);
    }
  };

  // Handler for when the calendar date is selected
  const handleEndDateChange = (date: Date | undefined) => {
    setValue("endDate", date, { shouldValidate: true });
    if (date) {
      const newDuration = differenceInDays(date, startOfDay(new Date())) + 1;
      setValue("duration", newDuration, { shouldValidate: true });
    } else {
      setValue("duration", undefined);
    }
  };

  // Effect to clear date/duration when "Limitless" is checked
  useEffect(() => {
    if (isLimitless) {
      setValue("endDate", null);
      setValue("duration", undefined);
    }
  }, [isLimitless, setValue]);

  // The submit handler with the corrected type signature
  const onSubmit = (data: ChallengeFormData) => {
    const submissionData = {
      ...data,
      endDate: data.isLimitless ? null : data.endDate,
    };
    mutate(submissionData, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" aria-label="Add Challenge">
          <PlusIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-col p-5"
        >
          <SheetHeader>
            <SheetTitle>Add New Challenge</SheetTitle>
            <SheetDescription className="text-xs sr-only">
              Fill out the fields below to create your Challenge.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-4 pt-4">
            <div className="grid gap-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Run 100km"
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
                placeholder="My plan to get fit (optional)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label htmlFor="duration">Duration (in days)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 30"
                  disabled={isLimitless}
                  {...register("duration", {
                    valueAsNumber: true,
                    onChange: handleDurationChange,
                  })}
                />
                {errors.duration && (
                  <p className="text-xs">{errors.duration.message}</p>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="endDate">Or Pick an End Date</Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          disabled={isLimitless}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={handleEndDateChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.endDate && (
                  <p className="text-xs">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Controller
                name="isLimitless"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="limitless"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="limitless" className="text-sm font-medium">
                Limitless? (no end date)
              </Label>
            </div>
          </div>

          <SheetFooter className="pt-4">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Challenge"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ChallengeNew;
