import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { ChallengeFormData } from "@/schemas/challenge-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateChallengeMutation = () => {
  const queryClient = useQueryClient();
  const storage = getStorageProvider();
  return useMutation({
    mutationFn: (challenge: ChallengeFormData) =>
      storage.createChallenge(challenge),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
};

export default useCreateChallengeMutation;
