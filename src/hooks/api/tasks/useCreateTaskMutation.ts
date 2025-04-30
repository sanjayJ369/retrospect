import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { TaskFormData } from "@/schemas/task-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  const storage = getStorageProvider();
  return useMutation({
    mutationFn: (task: TaskFormData) => storage.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useCreateTaskMutation;
