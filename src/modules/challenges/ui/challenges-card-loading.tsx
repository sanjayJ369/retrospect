import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/ui/8bit/container";

const ChallengesCardLoading = () => {
  return (
    <div className="w-full flex items-center justify-center my-4">
      <Container className="w-4/5 p-1 flex flex-col items-center justify-center">
        <div className="h-full overflow-hidden flex flex-col my-3">
          <div
            className="flex flex-col items-center justify-center sm:flex-row sm:justify-between
              sm:items-center gap-2 py-2"
          >
            <Skeleton className="h-8 w-32" />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Skeleton className="h-8 w-32" />
              <span className="px-4">
                <Skeleton className="h-8 w-8" />
              </span>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="h-full w-full md:w-4/5">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ChallengesCardLoading;
