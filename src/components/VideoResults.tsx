
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, Calendar } from "lucide-react";

interface VideoResultsProps {
  searchQuery: string;
}

const VideoResults = ({ searchQuery }: VideoResultsProps) => {
  // Mock data - in a real app, this would come from YouTube API
  const mockVideos = [
    {
      id: "1",
      title: `The Ultimate ${searchQuery} Guide That Changed Everything`,
      channel: "TechGuru Pro",
      views: "2.3M",
      duration: "12:45",
      uploadDate: "2 weeks ago",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop",
      engagement: "High",
      keyPoints: ["Clear introduction", "Step-by-step process", "Real examples", "Call to action"]
    },
    {
      id: "2",
      title: `Why Everyone Gets ${searchQuery} Wrong (But You Won't)`,
      channel: "Success Stories",
      views: "1.8M",
      duration: "15:23",
      uploadDate: "1 month ago",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop",
      engagement: "Very High",
      keyPoints: ["Hook with controversy", "Problem identification", "Solution reveal", "Social proof"]
    },
    {
      id: "3",
      title: `${searchQuery}: From Beginner to Expert in 30 Days`,
      channel: "Learn Fast Academy",
      views: "1.2M",
      duration: "18:12",
      uploadDate: "3 weeks ago",
      thumbnail: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=225&fit=crop",
      engagement: "High",
      keyPoints: ["Timeline promise", "Progress tracking", "Milestones", "Motivation"]
    },
    {
      id: "4",
      title: `The ${searchQuery} Mistake That Cost Me $10,000`,
      channel: "Honest Reviews",
      views: "950K",
      duration: "9:34",
      uploadDate: "5 days ago",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      engagement: "Medium",
      keyPoints: ["Personal story", "Costly mistake", "Lesson learned", "Prevention tips"]
    },
    {
      id: "5",
      title: `${searchQuery} Secrets the Pros Don't Want You to Know`,
      channel: "Insider Tips",
      views: "720K",
      duration: "14:56",
      uploadDate: "1 week ago",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      engagement: "High",
      keyPoints: ["Exclusive knowledge", "Industry secrets", "Advanced techniques", "Competitive advantage"]
    }
  ];

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
          {mockVideos.map((video, index) => (
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
