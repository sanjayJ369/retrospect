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
import { useChallenge } from "@/hooks/api/challenges/useChallengeQuery";
import { SetStateAction, useEffect } from "react";

interface ChallengeEditProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  challengeId: string;
}

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChallengeEditData,
  challengeEditSchema,
} from "@/schemas/challenge-schema";
import useEditChallengeMutation from "@/hooks/api/challenges/useEditChallengeMutation";

const ChallengeEdit = ({ open, setOpen, challengeId }: ChallengeEditProps) => {
  const { data: challenge, isLoading, isError } = useChallenge(challengeId);
  const { mutate } = useEditChallengeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChallengeEditData>({
    resolver: zodResolver(challengeEditSchema),
  });

  useEffect(() => {
    if (challenge) {
      reset({
        title: challenge.title,
        description: challenge.description,
      });
    }
  }, [challenge, reset]);

  if (isError) return <Alert>Error loading challenge</Alert>;
  if (isLoading || !challenge) return <p>Loading…</p>;

  const onSubmit: SubmitHandler<ChallengeEditData> = (data) => {
    console.log("Submitted:", data);
    // Merge edit data with existing challenge data
    const isLimitless = challenge.endDate === null;
    const updatedChallenge = {
      title: data.title,
      description: data.description,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      isLimitless: isLimitless,
      duration: challenge.duration,
    };
    mutate({ id: challenge.id, challenge: updatedChallenge });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form className="contents" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Challenge</DialogTitle>
            <DialogDescription className="text-xs">
              Make changes to your Challenge here. Click save when done.
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} className="max-w-72" />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}

          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />

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

export default ChallengeEdit;
