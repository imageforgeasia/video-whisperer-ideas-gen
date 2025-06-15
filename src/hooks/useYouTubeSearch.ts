
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const useYouTubeSearch = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchYouTubeData = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim() === '') {
      console.error('Empty search query provided');
      setError('Please provide a search query');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching YouTube data for:", searchQuery);
      
      // Ensure we're sending a proper JSON body
      const requestBody = { searchQuery: searchQuery.trim() };
      const bodyString = JSON.stringify(requestBody);
      console.log("Request body object:", requestBody);
      console.log("Request body string:", bodyString);
      console.log("Request body length:", bodyString.length);
      
      const { data, error } = await supabase.functions.invoke('youtube-search', {
        body: bodyString,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("Supabase function response:", { data, error });

      if (error) {
        console.error("YouTube API error:", error);
        
        // Handle different types of errors
        let errorMessage = "Failed to fetch YouTube data";
        
        if (error.message?.includes("Failed to send a request")) {
          errorMessage = "Unable to connect to YouTube service. Please check your internet connection and try again.";
        } else if (error.message?.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast({
          title: "Connection Error",
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
      
      let errorMessage = "Failed to connect to YouTube service";
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
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

  return {
    videos,
    loading,
    error,
    fetchYouTubeData
  };
};
