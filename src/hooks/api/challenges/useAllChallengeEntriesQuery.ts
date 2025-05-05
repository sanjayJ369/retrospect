import { useQuery } from "@tanstack/react-query";
import { getStorageProvider } from "@/lib/storage/StorageProvider";

export function useAllChallengeEntriesQuery(id: string) {
  const storage = getStorageProvider();

  return useQuery({
    queryKey: ["challenges", id],
    queryFn: () => storage.getChallengeEntries(id),
    enabled: !!id,
  });
}
