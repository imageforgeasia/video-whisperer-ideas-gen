
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface VideoResultsErrorProps {
  error: string;
  onRetry: () => void;
}

const VideoResultsError = ({ error, onRetry }: VideoResultsErrorProps) => {
  return (
    <div>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="mb-4">
          {error}
        </AlertDescription>
      </Alert>
      <Button 
        onClick={onRetry}
        variant="outline"
        size="sm"
        className="mt-2"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
        <p className="font-medium mb-2">Troubleshooting tips:</p>
        <ul className="space-y-1 text-xs">
          <li>• Check your internet connection</li>
          <li>• Wait a moment and try again</li>
          <li>• Try a different search term</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoResultsError;
