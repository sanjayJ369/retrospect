import { useAuth } from "@/context/auth-provider";
import { ChallengeFormData } from "@/schemas/challenge-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateChallengeMutation = () => {
  const queryClient = useQueryClient();
  const { storage } = useAuth();
  return useMutation({
    mutationFn: (challenge: ChallengeFormData) =>
      storage.createChallenge(challenge),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
};

export default useCreateChallengeMutation;
