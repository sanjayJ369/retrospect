import { useQuery } from "@tanstack/react-query";
import { getStorageProvider } from "@/lib/storage/StorageProvider";

export function useTaskQuery(id: string) {
  const storage = getStorageProvider();

  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => storage.getTask(id),
    enabled: !!id,
  });
}
