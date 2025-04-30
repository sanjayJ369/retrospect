import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { useMutation } from "@tanstack/react-query";
const useDeleteTaskMutation = () => {
  const storage = getStorageProvider();
  return useMutation({
    mutationFn: (id: string) => storage.deleteTask(id),
  });
};

export default useDeleteTaskMutation;
