import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  const storage = getStorageProvider();
  return useMutation({
    mutationFn: (id: string) => storage.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useDeleteTaskMutation;
