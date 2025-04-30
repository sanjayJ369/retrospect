import { getStorageProvider } from "@/lib/storage/StorageProvider";
import { TaskFormData } from "@/schemas/task-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const useEditTaskMutation = () => {
  const queryClient = useQueryClient();
  const storage = getStorageProvider();
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: TaskFormData }) =>
      storage.editTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useEditTaskMutation;
