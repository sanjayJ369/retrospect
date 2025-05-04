import { useQuery } from "@tanstack/react-query";
import { getStorageProvider } from "@/lib/storage/StorageProvider";

export function useChallenge(id: string) {
  const storage = getStorageProvider();

  return useQuery({
    queryKey: ["challenges", id],
    queryFn: () => storage.getChallenge(id),
    enabled: !!id,
  });
}
