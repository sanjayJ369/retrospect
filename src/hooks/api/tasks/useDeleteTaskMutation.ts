import { useAuth } from "@/context/auth-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  const { storage } = useAuth();
  return useMutation({
    mutationFn: (id: string) => storage.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useDeleteTaskMutation;
