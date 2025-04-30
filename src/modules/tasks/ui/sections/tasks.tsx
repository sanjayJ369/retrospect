import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import TaskCard from "../components/task-card";

const Tasks = () => {
  return (
    <Card>
      <CardHeader className="flex justify-center">
        <CardTitle className="font-bold text-2xl">T A S K S</CardTitle>
      </CardHeader>
      <CardContent>
        <TaskCard id="1" title="hello" checked={false} />
      </CardContent>
    </Card>
  );
};

export default Tasks;
