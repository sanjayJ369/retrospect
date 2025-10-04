import { useAuth } from "@/context/auth-provider";
import { useMutation } from "@tanstack/react-query";

const useChallengeEntryDoneMutation = () => {
  const { storage } = useAuth();
  return useMutation({
    mutationFn: (variables: { id: string; date: Date; done: boolean }) =>
      storage.markChallengeDone(variables.id, variables.date, variables.done),
  });
};

export default useChallengeEntryDoneMutation;
