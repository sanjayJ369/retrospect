import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { useMutation } from "@tanstack/react-query";

const useChallengeEntryDoneMutation = () => {
  const storage = getStorageProvider();
  return useMutation({
    mutationFn: (variables: { id: string; date: Date; done: boolean }) =>
      storage.markChallengeDone(variables.id, variables.date, variables.done),
  });
};

export default useChallengeEntryDoneMutation;
