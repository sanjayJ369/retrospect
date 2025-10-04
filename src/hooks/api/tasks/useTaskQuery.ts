import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-provider";

export function useTaskQuery(id: string) {
  const { storage } = useAuth();

  return useQuery({
    queryKey: ["tasks", id],
    queryFn: () => storage.getTask(id),
    enabled: !!id,
  });
}
