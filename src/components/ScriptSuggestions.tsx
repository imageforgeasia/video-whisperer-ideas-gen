
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ScriptSuggestionsProps {
  searchQuery: string;
}

const ScriptSuggestions = ({ searchQuery }: ScriptSuggestionsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const scriptIdeas = [
    {
      title: `The ${searchQuery} Method That Actually Works`,
      hook: `"I spent $5,000 learning ${searchQuery} the hard way, so you don't have to."`,
      structure: ["Personal failure story", "Discovery moment", "Step-by-step method", "Results proof", "Call to action"],
      estimatedViews: "500K - 1.2M",
      difficulty: "Beginner"
    },
    {
      title: `5 ${searchQuery} Mistakes Killing Your Results`,
      hook: `"If you're doing any of these 5 things with ${searchQuery}, you're wasting your time."`,
      structure: ["Attention-grabbing stat", "Mistake #1-5 breakdown", "Real examples", "Better alternatives", "Summary"],
      estimatedViews: "300K - 800K",
      difficulty: "Intermediate"
    },
    {
      title: `${searchQuery}: Beginner to Pro in 30 Days`,
      hook: `"Here's exactly how I went from zero to expert in ${searchQuery} in just 30 days."`,
      structure: ["Before/after reveal", "Day 1-10 foundation", "Day 11-20 building", "Day 21-30 mastery", "Resources"],
      estimatedViews: "400K - 1M",
      difficulty: "Beginner"
    }
  ];

  const handleCopyScript = (script: string) => {
    navigator.clipboard.writeText(script);
    toast({
      title: "Script copied!",
      description: "The script outline has been copied to your clipboard.",
    });
  };

  const handleRegenerateIdeas = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "New ideas generated!",
        description: "Fresh script suggestions have been created based on the latest trends.",
      });
    }, 2000);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            AI Script Suggestions
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRegenerateIdeas}
            disabled={isGenerating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? "Generating..." : "New Ideas"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {scriptIdeas.map((idea, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-gray-900">{idea.title}</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleCopyScript(JSON.stringify(idea, null, 2))}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
              <p className="text-sm font-medium text-yellow-800">Hook:</p>
              <p className="text-sm text-yellow-700 italic">"{idea.hook}"</p>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Suggested Structure:</p>
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

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                {idea.estimatedViews}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {idea.difficulty}
              </Badge>
            </div>
          </div>
        ))}

        {/* Pro Tips */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-green-800">💡 Pro Tips for Success</h4>
          <ul className="text-sm space-y-1 text-green-700">
            <li>• Create your hook in the first 8 seconds</li>
            <li>• Use pattern interrupts every 30-45 seconds</li>
            <li>• Include a clear call-to-action</li>
            <li>• Add timestamps in your description</li>
            <li>• End with a question to boost comments</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptSuggestions;
