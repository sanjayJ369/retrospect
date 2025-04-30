import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import useDeleteTaskMutation from "@/hooks/api/tasks/useDeleteTaskMutation";
import { Edit2Icon, EllipsisVerticalIcon, Trash2Icon } from "lucide-react";
import TaskEdit from "./task-edit";
import { useState } from "react";

interface TaskMutateProps {
  id: string;
}

const TaskMutate = ({ id }: TaskMutateProps) => {
  const { mutate: deleteTask } = useDeleteTaskMutation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  return (
    <>
      <TaskEdit open={isEdit} setOpen={setIsEdit} taskId={id} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-xs w-56 rounded-none overflow-clip">
          <DropdownMenuItem
            onClick={() => {
              requestAnimationFrame(() => setIsEdit(true));
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <Edit2Icon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => deleteTask(id)}>
            Delete
            <DropdownMenuShortcut>
              <Trash2Icon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TaskMutate;
