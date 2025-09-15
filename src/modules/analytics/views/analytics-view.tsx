"use client";

import { Button } from "@/components/ui/8bit/button";
import Container from "@/components/ui/8bit/container";
import { useAllChallengesQuery } from "@/hooks/api/challenges/useAllChallengesQuery";
import { useAllTaskQuery } from "@/hooks/api/tasks/useAllTasksQuery";
import { format } from "date-fns";

const AnalyticsView = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: tasks } = useAllTaskQuery(today);
  const { data: challenges } = useAllChallengesQuery();

  const handleExport = () => {
    const data = {
      tasks,
      challenges,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "retrospect-analytics.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg">Analytics</h1>
        <Button onClick={handleExport}>Export</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Container className="p-4">
          <h2 className="text-md">Tasks</h2>
          <p>Total tasks today: {tasks?.length ?? "..."}</p>
        </Container>
        <Container className="p-4">
          <h2 className="text-md">Challenges</h2>
          <p>Total challenges: {challenges?.length ?? "..."}</p>
        </Container>
      </div>
    </div>
  );
};

export default AnalyticsView;
