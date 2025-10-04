import { useAuth } from "@/context/auth-provider";
import { useQuery } from "@tanstack/react-query";

export function useAllChallengesQuery() {
  const { storage } = useAuth();

  return useQuery({
    queryKey: ["challenges"],
    queryFn: () => storage.getAllChallenges(),
  });
}
