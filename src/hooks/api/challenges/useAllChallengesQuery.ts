import { useQuery } from "@tanstack/react-query";
import { getStorageProvider } from "@/lib/storage/StorageProvider";

export function useAllChallengesQuery() {
  const storage = getStorageProvider();

  return useQuery({
    queryKey: ["challenges"],
    queryFn: () => storage.getAllChallenges(),
  });
}
