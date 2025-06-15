
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Copy, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useYouTubeSearch } from "@/hooks/useYouTubeSearch";

interface ScriptSuggestionsProps {
  searchQuery: string;
}

interface AnalyzedPattern {
  pattern: string;
  frequency: number;
  examples: string[];
}

interface ScriptIdea {
  title: string;
  hook: string;
  structure: string[];
  estimatedViews: string;
  difficulty: string;
  basedOn: string;
}

const ScriptSuggestions = ({ searchQuery }: ScriptSuggestionsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptIdeas, setScriptIdeas] = useState<ScriptIdea[]>([]);
  const [patterns, setPatterns] = useState<AnalyzedPattern[]>([]);
  const { videos } = useYouTubeSearch();
  const { toast } = useToast();

  const analyzeVideoPatterns = () => {
    if (!videos || videos.length === 0) return [];

    const titleWords: { [key: string]: number } = {};
    const commonPhrases: { [key: string]: string[] } = {};
    
    // Analyze title patterns
    videos.forEach(video => {
      const title = video.title.toLowerCase();
      
      // Track common words
      const words = title.split(/\s+/).filter(word => word.length > 3);
      words.forEach(word => {
        titleWords[word] = (titleWords[word] || 0) + 1;
      });

      // Track common phrases
      if (title.includes('how to')) {
        commonPhrases['how-to'] = [...(commonPhrases['how-to'] || []), video.title];
      }
      if (title.includes('mistake') || title.includes('error') || title.includes('wrong')) {
        commonPhrases['mistakes'] = [...(commonPhrases['mistakes'] || []), video.title];
      }
      if (title.includes('secret') || title.includes('hack') || title.includes('trick')) {
        commonPhrases['secrets'] = [...(commonPhrases['secrets'] || []), video.title];
      }
      if (title.includes('beginner') || title.includes('start')) {
        commonPhrases['beginner'] = [...(commonPhrases['beginner'] || []), video.title];
      }
      if (/\d+/.test(title)) {
        commonPhrases['numbered'] = [...(commonPhrases['numbered'] || []), video.title];
      }
    });

    // Convert to patterns
    const detectedPatterns: AnalyzedPattern[] = [];
    
    Object.entries(commonPhrases).forEach(([pattern, examples]) => {
      if (examples.length >= 2) {
        detectedPatterns.push({
          pattern,
          frequency: examples.length,
          examples: examples.slice(0, 3)
        });
      }
    });

    return detectedPatterns;
  };

  const generateDataDrivenScripts = () => {
    if (!videos || videos.length === 0) return [];

    const analyzedPatterns = analyzeVideoPatterns();
    const avgViews = videos.reduce((sum, video) => {
      const views = parseFloat(video.views.replace(/[KM]/g, '')) * 
        (video.views.includes('M') ? 1000000 : video.views.includes('K') ? 1000 : 1);
      return sum + views;
    }, 0) / videos.length;

    const topPerformers = videos
      .sort((a, b) => {
        const aViews = parseFloat(a.views.replace(/[KM]/g, '')) * 
          (a.views.includes('M') ? 1000000 : a.views.includes('K') ? 1000 : 1);
        const bViews = parseFloat(b.views.replace(/[KM]/g, '')) * 
          (b.views.includes('M') ? 1000000 : b.views.includes('K') ? 1000 : 1);
        return bViews - aViews;
      })
      .slice(0, 3);

    const ideas: ScriptIdea[] = [];

    // Generate ideas based on top performers
    if (topPerformers.length > 0) {
      const topVideo = topPerformers[0];
      ideas.push({
        title: `What ${topVideo.channel} Got Right About ${searchQuery}`,
        hook: `"This ${searchQuery} video got ${topVideo.views} views. Here's why it worked."`,
        structure: [
          "Show the successful video",
          "Break down what made it work", 
          "Extract key principles",
          "Apply to your content",
          "Results comparison"
        ],
        estimatedViews: `${Math.round(avgViews / 1000)}K - ${Math.round(avgViews / 500)}K`,
        difficulty: "Intermediate",
        basedOn: `Analysis of ${topVideo.channel}'s ${topVideo.views} video`
      });
    }

    // Generate ideas based on detected patterns
    analyzedPatterns.forEach(pattern => {
      switch (pattern.pattern) {
        case 'how-to':
          ideas.push({
            title: `${searchQuery}: Step-by-Step Tutorial That Actually Works`,
            hook: `"I analyzed ${pattern.frequency} tutorials and found the method that works every time."`,
            structure: [
              "Problem introduction",
              "Method comparison",
              "Step-by-step walkthrough",
              "Common pitfalls to avoid",
              "Results showcase"
            ],
            estimatedViews: `${Math.round(avgViews / 1200)}K - ${Math.round(avgViews / 600)}K`,
            difficulty: "Beginner",
            basedOn: `${pattern.frequency} successful tutorial videos`
          });
          break;
          
        case 'mistakes':
          ideas.push({
            title: `${pattern.frequency} ${searchQuery} Mistakes I Made So You Don't Have To`,
            hook: `"These ${searchQuery} mistakes cost me everything. Learn from my failures."`,
            structure: [
              "Personal failure story",
              "Mistake breakdown",
              "Cost of each mistake",
              "Correct approach",
              "Success transformation"
            ],
            estimatedViews: `${Math.round(avgViews / 800)}K - ${Math.round(avgViews / 400)}K`,
            difficulty: "Intermediate",
            basedOn: `Analysis of ${pattern.frequency} mistake-focused videos`
          });
          break;

        case 'secrets':
          ideas.push({
            title: `${searchQuery} Secrets Only Pros Know`,
            hook: `"After studying ${videos.length} top ${searchQuery} videos, I found these hidden patterns."`,
            structure: [
              "Research methodology",
              "Pattern discovery",
              "Secret techniques revealed",
              "Why they work",
              "Implementation guide"
            ],
            estimatedViews: `${Math.round(avgViews / 600)}K - ${Math.round(avgViews / 300)}K`,
            difficulty: "Advanced",
            basedOn: `Data analysis of ${videos.length} top videos`
          });
          break;
      }
    });

    // Fallback ideas if no patterns detected
    if (ideas.length === 0) {
      ideas.push({
        title: `I Analyzed ${videos.length} ${searchQuery} Videos - Here's What Works`,
        hook: `"After watching ${videos.length} ${searchQuery} videos, I discovered the formula for success."`,
        structure: [
          "Research methodology",
          "Key pattern analysis", 
          "Success formula breakdown",
          "Implementation strategy",
          "Results prediction"
        ],
        estimatedViews: `${Math.round(avgViews / 1000)}K - ${Math.round(avgViews / 500)}K`,
        difficulty: "Intermediate",
        basedOn: `Comprehensive analysis of current top ${videos.length} videos`
      });
    }

    return ideas.slice(0, 3);
  };

  useEffect(() => {
    if (videos && videos.length > 0) {
      const newPatterns = analyzeVideoPatterns();
      const newIdeas = generateDataDrivenScripts();
      setPatterns(newPatterns);
      setScriptIdeas(newIdeas);
    }
  }, [videos, searchQuery]);

  const handleCopyScript = (script: ScriptIdea) => {
    const scriptText = `Title: ${script.title}

Hook: ${script.hook}

Structure:
${script.structure.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

Based on: ${script.basedOn}
Estimated Views: ${script.estimatedViews}
Difficulty: ${script.difficulty}`;

    navigator.clipboard.writeText(scriptText);
    toast({
      title: "Script copied!",
      description: "The data-driven script outline has been copied to your clipboard.",
    });
  };

  const handleRegenerateIdeas = () => {
    setIsGenerating(true);
    setTimeout(() => {
      if (videos && videos.length > 0) {
        const newIdeas = generateDataDrivenScripts();
        setScriptIdeas(newIdeas);
      }
      setIsGenerating(false);
      toast({
        title: "Scripts regenerated!",
        description: "New data-driven suggestions based on current top videos.",
      });
    }, 1500);
  };

  if (!videos || videos.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            AI Script Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Search for videos first to get data-driven script suggestions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Data-Driven Script Ideas
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRegenerateIdeas}
            disabled={isGenerating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? "Analyzing..." : "Regenerate"}
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          Based on analysis of {videos.length} current top videos for "{searchQuery}"
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Detected Patterns */}
        {patterns.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Detected Success Patterns
            </h4>
            <div className="space-y-2">
              {patterns.map((pattern, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium text-blue-700 capitalize">
                    {pattern.pattern.replace('-', ' ')} format:
                  </span>
                  <span className="text-blue-600 ml-2">
                    Found in {pattern.frequency} of {videos.length} top videos
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {scriptIdeas.map((idea, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-gray-900">{idea.title}</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCopyScript(idea)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              <p className="text-sm font-medium text-yellow-800">Hook:</p>
              <p className="text-sm text-yellow-700 italic">"{idea.hook}"</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Data-Driven Structure:</p>
              <ol className="text-sm space-y-1">
                {idea.structure.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {idx + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {idea.estimatedViews}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {idea.difficulty}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Based on:</strong> {idea.basedOn}
              </p>
            </div>
          </div>
        ))}

        {/* Data-Driven Tips */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-green-800">📊 Data Insights from Top Videos</h4>
          <ul className="text-sm space-y-1 text-green-700">
            <li>• Average engagement: {videos.length > 0 ? videos[0]?.engagement || 'N/A' : 'N/A'}</li>
            <li>• Optimal duration: {videos.length > 0 ? videos[0]?.duration || 'N/A' : 'N/A'} (based on top performer)</li>
            <li>• Upload timing: Recent uploads show better performance</li>
            <li>• Title length: {videos.length > 0 ? `~${videos[0]?.title?.length || 0} characters` : 'N/A'} works well</li>
            <li>• Thumbnails: High contrast and clear text perform better</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptSuggestions;
