"use client";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { Calendar } from "@/components/ui/8bit/calendar";
import { format } from "date-fns";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
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
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [isLimitless, setIsLimitless] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: undefined,
    },
  });

  const onSubmit: SubmitHandler<ChallengeFormData> = (data) => {
    console.log("create new challenge:", data);
    mutate(data);
    setOpen(false);
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
            <SheetDescription className="text-xs">
              Fill out the fields below to create your Challenge.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-4 pt-4">
            <div className="grid gap-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g. 100 situps, 100 pushup, 100 squats, 10km run"
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
                placeholder="Training Plan to become one punch man (optional)"
                rows={3}
              />
            </div>

            <div className="grid gap-1">
              <Label className="m-1" htmlFor="duration">
                End Date{" "}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[310px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="border-y-0"
                    disabled={isLimitless}
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-xs">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2 my-2">
            <Checkbox
              id="limitless"
              checked={isLimitless}
              onCheckedChange={() => setIsLimitless(!isLimitless)}
            />
            <Label
              htmlFor="limitless"
              className="text-sm font-medium leading-none m-1"
            >
              Limitless? (no end date)
            </Label>
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
