import { useAuth } from "@/context/auth-provider";
import { TaskFormData } from "@/schemas/task-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  const { storage } = useAuth();
  return useMutation({
    mutationFn: (task: TaskFormData) => storage.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export default useCreateTaskMutation;
