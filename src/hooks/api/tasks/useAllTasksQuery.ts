import { useQuery } from "@tanstack/react-query";
import { getStorageProvider } from "@/lib/storage/StorageProvider";

export function useAllTaskQuery(date: string) {
  const storage = getStorageProvider();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => storage.getAllTasks(date),
    enabled: !!date,
  });
}
