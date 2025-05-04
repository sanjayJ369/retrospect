import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { useMutation } from "@tanstack/react-query";

const useChallengeEntryDoneMutation = () => {
  const storage = getStorageProvider();
  return useMutation({
    mutationFn: (id: string) => storage.markChallengeDone(id),
  });
};

export default useChallengeEntryDoneMutation;
