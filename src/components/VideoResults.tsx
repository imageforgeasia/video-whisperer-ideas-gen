
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    if (searchQuery) {
      fetchYouTubeData();
    }
  }, [searchQuery]);

  const fetchYouTubeData = async () => {
    setLoading(true);
    try {
      console.log("Fetching YouTube data for:", searchQuery);
      
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: { searchQuery }
      });

      if (error) {
        console.error("YouTube API error:", error);
        toast({
          title: "Error fetching YouTube data",
          description: "Failed to fetch real YouTube results. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data && data.videos) {
        setVideos(data.videos);
        console.log("Fetched videos:", data.videos);
      }
    } catch (error) {
      console.error("Error calling YouTube API:", error);
      toast({
        title: "Error",
        description: "Failed to connect to YouTube API. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
