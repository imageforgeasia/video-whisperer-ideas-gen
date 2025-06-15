
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface VideoResultsProps {
  searchQuery: string;
}

interface VideoData {
  id: string;
  title: string;
  channel: string;
  views: string;
  duration: string;
  uploadDate: string;
  thumbnail: string;
  engagement: string;
  keyPoints: string[];
}

const VideoResults = ({ searchQuery }: VideoResultsProps) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (searchQuery) {
      fetchYouTubeData();
    }
  }, [searchQuery]);

  const fetchYouTubeData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching YouTube data for:", searchQuery);
      
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { searchQuery }
      });

      console.log("Supabase function response:", { data, error });

      if (error) {
        console.error("YouTube API error:", error);
        const errorMessage = error.message || "Failed to fetch YouTube data";
        setError(errorMessage);
        toast({
          title: "Error fetching YouTube data",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data && data.videos && Array.isArray(data.videos)) {
        setVideos(data.videos);
        console.log("Fetched videos:", data.videos);
        toast({
          title: "Success",
          description: `Found ${data.videos.length} videos for "${searchQuery}"`,
        });
      } else if (data && data.error) {
        const errorMessage = data.message || data.error;
        setError(errorMessage);
        toast({
          title: "No results found",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        setError("No videos found for this search query");
        toast({
          title: "No results",
          description: "No videos found for this search query",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error calling YouTube API:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to connect to YouTube API";
      setError(errorMessage);
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchYouTubeData();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Top 5 Video Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Fetching real YouTube results...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Top 5 Video Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mb-4">
              {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={handleRetry}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Top 5 Video Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600">No videos found for "{searchQuery}"</p>
            <Button 
              onClick={handleRetry}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          Top 5 Video Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {videos.map((video, index) => (
            <div key={video.id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="relative flex-shrink-0">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-32 h-18 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1 rounded">
                  #{index + 1}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="font-medium">{video.channel}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {video.views} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {video.uploadDate}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant={video.engagement === 'Very High' ? 'default' : video.engagement === 'High' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {video.engagement} Engagement
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {video.keyPoints.map((point, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoResults;
