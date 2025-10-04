import { useAuth } from "@/context/auth-provider";
import { useQuery } from "@tanstack/react-query";

export function useAllTaskQuery(date: string) {
  const { storage } = useAuth();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => storage.getAllTasks(date),
    enabled: !!date,
  });
}
