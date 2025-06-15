
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar } from "lucide-react";

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

interface VideoCardProps {
  video: VideoData;
  index: number;
}

const VideoCard = ({ video, index }: VideoCardProps) => {
  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
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
  );
};

export default VideoCard;
