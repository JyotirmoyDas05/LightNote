import { Skeleton } from "@/components/ui/skeleton";
// Simulate loading state for demo
const loading = false; // Set to true to show skeletons
export const Notebooks = () => {
  return (
    <div>
      <h2>Your Notebooks</h2>
      {loading ? (
        <div className="flex flex-col gap-2 mt-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-8 w-1/4" />
        </div>
      ) : (
        <div>{/* Render notebooks here */}</div>
      )}
    </div>
  );
};
