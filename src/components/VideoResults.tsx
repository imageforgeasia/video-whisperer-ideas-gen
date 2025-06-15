
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { useEffect } from "react";
import { useYouTubeSearch } from "@/hooks/useYouTubeSearch";
import VideoCard from "@/components/VideoCard";
import VideoResultsError from "@/components/VideoResultsError";
import VideoResultsLoading from "@/components/VideoResultsLoading";
import VideoResultsEmpty from "@/components/VideoResultsEmpty";

interface VideoResultsProps {
  searchQuery: string;
}

const VideoResults = ({ searchQuery }: VideoResultsProps) => {
  const { videos, loading, error, fetchYouTubeData } = useYouTubeSearch();

  useEffect(() => {
    if (searchQuery) {
      fetchYouTubeData(searchQuery);
    }
  }, [searchQuery]);

  const handleRetry = () => {
    console.log("Retrying YouTube search...");
    fetchYouTubeData(searchQuery);
  };

  const renderContent = () => {
    if (loading) {
      return <VideoResultsLoading />;
    }

    if (error) {
      return <VideoResultsError error={error} onRetry={handleRetry} />;
    }

    if (videos.length === 0) {
      return <VideoResultsEmpty searchQuery={searchQuery} onRetry={handleRetry} />;
    }

    return (
      <div className="grid gap-4">
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          Top 5 Video Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default VideoResults;
