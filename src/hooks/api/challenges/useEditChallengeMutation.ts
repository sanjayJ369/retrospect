import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { ChallengeFormData } from "@/schemas/challenge-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useEditChallengeMutation = () => {
  const queryClient = useQueryClient();
  const storage = getStorageProvider();
  return useMutation({
    mutationFn: (variables: { id: string; challenge: ChallengeFormData }) =>
      storage.editChallenge(variables.id, variables.challenge),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
};

export default useEditChallengeMutation;
