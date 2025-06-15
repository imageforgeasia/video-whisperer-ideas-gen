
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface VideoResultsEmptyProps {
  searchQuery: string;
  onRetry: () => void;
}

const VideoResultsEmpty = ({ searchQuery, onRetry }: VideoResultsEmptyProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-600">No videos found for "{searchQuery}"</p>
      <Button 
        onClick={onRetry}
        variant="outline"
        size="sm"
        className="mt-4"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};

export default VideoResultsEmpty;
