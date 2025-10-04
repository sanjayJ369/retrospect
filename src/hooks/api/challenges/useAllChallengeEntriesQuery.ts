import { useAuth } from "@/context/auth-provider";
import { useQuery } from "@tanstack/react-query";

export function useAllChallengeEntriesQuery(id: string) {
  const { storage } = useAuth();

  return useQuery({
    queryKey: ["challenges", id],
    queryFn: () => storage.getChallengeEntries(id),
    enabled: !!id,
  });
}
