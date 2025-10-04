import { useAuth } from "@/context/auth-provider";
import { TaskFormData } from "@/schemas/task-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const useEditTaskMutation = () => {
  const queryClient = useQueryClient();
  const { storage } = useAuth();
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: TaskFormData }) =>
      storage.editTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useEditTaskMutation;
