import { useAuth } from "@/context/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useChallengeEntryDoneToggleMutation = () => {
  const queryClient = useQueryClient();
  const { storage } = useAuth();
  return useMutation({
    mutationFn: async (variables: {
      id: string;
      date: Date;
      done: boolean;
    }) => {
      if (variables.done) {
        return await storage.markChallengeDone(
          variables.id,
          variables.date,
          variables.done,
        );
      } else {
        return await storage.markChallengeNotDone(variables.id, variables.date);
      }
    },

    onSuccess: () => {
      console.log("invalidated challengeEntries");
      queryClient.invalidateQueries({ queryKey: ["challengeEntries"] });
    },
  });
};

export default useChallengeEntryDoneToggleMutation;
