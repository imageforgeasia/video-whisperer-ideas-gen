import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('YouTube search function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery } = await req.json();
    console.log('Search query:', searchQuery);
    
    if (!searchQuery) {
      console.error('No search query provided');
      return new Response(JSON.stringify({ error: 'Search query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
    console.log('API key available:', !!youtubeApiKey);
    
    if (!youtubeApiKey) {
      console.error('YouTube API key not found in environment');
      return new Response(JSON.stringify({ 
        error: 'YouTube API key not configured',
        message: 'Please ensure YOUTUBE_API_KEY is set in Supabase secrets'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch search results from YouTube Data API
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(searchQuery)}&type=video&order=relevance&key=${youtubeApiKey}`;
    console.log('Calling YouTube Search API...');
    
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      const errorData = await searchResponse.text();
      console.error('YouTube Search API error:', searchResponse.status, errorData);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch YouTube search results',
        status: searchResponse.status,
        details: errorData 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const searchData = await searchResponse.json();
    console.log('Search results received:', searchData.items?.length || 0, 'videos');

    if (!searchData.items || searchData.items.length === 0) {
      console.log('No videos found for query:', searchQuery);
      return new Response(JSON.stringify({ 
        error: 'No videos found',
        message: `No videos found for "${searchQuery}". Try a different search term.`
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get video IDs for detailed statistics
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    
    // Fetch video details including statistics
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${youtubeApiKey}`;
    console.log('Calling YouTube Videos API...');
    
    const videosResponse = await fetch(videosUrl);

    if (!videosResponse.ok) {
      const errorData = await videosResponse.text();
      console.error('YouTube Videos API error:', videosResponse.status, errorData);
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch video details',
        status: videosResponse.status,
        details: errorData 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const videosData = await videosResponse.json();
    console.log('Video details received for', videosData.items?.length || 0, 'videos');

    // Format the response
    const formattedVideos = videosData.items.map((video: any, index: number) => {
      const searchItem = searchData.items.find((item: any) => item.id.videoId === video.id);
      
      return {
        id: video.id,
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        views: formatViewCount(video.statistics.viewCount || '0'),
        duration: formatDuration(video.contentDetails.duration),
        uploadDate: formatUploadDate(video.snippet.publishedAt),
        thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url || '',
        engagement: calculateEngagement(video.statistics),
        keyPoints: generateKeyPoints(video.snippet.title)
      };
    });

    console.log('Returning formatted videos:', formattedVideos.length);

    return new Response(JSON.stringify({ videos: formattedVideos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in youtube-search function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function formatViewCount(views: string): string {
  const num = parseInt(views);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatDuration(duration: string): string {
  // Convert ISO 8601 duration (PT4M13S) to readable format (4:13)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatUploadDate(publishedAt: string): string {
  const now = new Date();
  const published = new Date(publishedAt);
  const diffTime = Math.abs(now.getTime() - published.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
}

function calculateEngagement(statistics: any): string {
  const views = parseInt(statistics.viewCount || '0');
  const likes = parseInt(statistics.likeCount || '0');
  const comments = parseInt(statistics.commentCount || '0');
  
  if (views === 0) return 'Low';
  
  const engagementRate = ((likes + comments) / views) * 100;
  
  if (engagementRate > 5) return 'Very High';
  if (engagementRate > 2) return 'High';
  if (engagementRate > 0.5) return 'Medium';
  return 'Low';
}

function generateKeyPoints(title: string): string[] {
  const points = [];
  
  if (title.toLowerCase().includes('how to') || title.toLowerCase().includes('tutorial')) {
    points.push('Step-by-step guide');
  }
  if (title.toLowerCase().includes('secret') || title.toLowerCase().includes('hack')) {
    points.push('Insider tips');
  }
  if (title.toLowerCase().includes('mistake') || title.toLowerCase().includes('wrong')) {
    points.push('Common mistakes');
  }
  if (title.toLowerCase().includes('beginner') || title.toLowerCase().includes('start')) {
    points.push('Beginner friendly');
  }
  if (title.includes('?')) {
    points.push('Problem solving');
  }
  
  // Add some generic points if we don't have enough
  while (points.length < 3) {
    const genericPoints = ['Clear explanation', 'Practical examples', 'Actionable advice', 'Real results'];
    const randomPoint = genericPoints[Math.floor(Math.random() * genericPoints.length)];
    if (!points.includes(randomPoint)) {
      points.push(randomPoint);
    }
  }
  
  return points.slice(0, 4);
}
