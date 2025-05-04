import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteChallengeMutation = () => {
  const storage = getStorageProvider();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storage.deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
};

export default useDeleteChallengeMutation;
