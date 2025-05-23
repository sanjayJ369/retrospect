import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/8bit/dialog";
import { useTaskQuery } from "@/hooks/api/tasks/useTaskQuery";

interface TaskDialogProps {
  id: string;
  title: string;
}

const TaskDialog = ({ id, title }: TaskDialogProps) => {
  const { data: taskdata, isLoading, isError } = useTaskQuery(id);
  if (isLoading) {
    // TODO: add skeliton
    return <p>Loading</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{taskdata?.title}</DialogTitle>
          <DialogDescription className="text-md">
            {taskdata?.description}
          </DialogDescription>
        </DialogHeader>
        <p>Duration: {taskdata?.duration} mins</p>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
