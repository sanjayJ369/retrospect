import { useAuth } from "@/context/auth-provider";
import { useQuery } from "@tanstack/react-query";

export function useChallenge(id: string) {
  const { storage } = useAuth();

  return useQuery({
    queryKey: ["challenges", id],
    queryFn: () => storage.getChallenge(id),
    enabled: !!id,
  });
}
