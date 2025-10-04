import { useAuth } from "@/context/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteChallengeMutation = () => {
  const { storage } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storage.deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
};

export default useDeleteChallengeMutation;
