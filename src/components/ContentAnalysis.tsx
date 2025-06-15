
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Users, Clock } from "lucide-react";

const ContentAnalysis = () => {
  const patterns = [
    { category: "Hook Techniques", score: 92, description: "Strong opening statements" },
    { category: "Problem-Solution Format", score: 87, description: "Clear value proposition" },
    { category: "Personal Stories", score: 78, description: "Emotional connection" },
    { category: "Step-by-Step Guides", score: 95, description: "Actionable content" },
    { category: "Social Proof", score: 82, description: "Credibility building" }
  ];

  const engagementData = [
    { name: "0-2min", retention: 95, engagement: 88 },
    { name: "2-5min", retention: 78, engagement: 92 },
    { name: "5-10min", retention: 65, engagement: 85 },
    { name: "10-15min", retention: 52, engagement: 78 },
    { name: "15min+", retention: 38, engagement: 72 }
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Content Pattern Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Success Patterns */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            Successful Content Patterns
          </h4>
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{pattern.category}</span>
                  <span className="text-sm text-gray-600">{pattern.score}%</span>
                </div>
                <Progress value={pattern.score} className="h-2" />
                <p className="text-xs text-gray-600">{pattern.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Timeline */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            Viewer Engagement Timeline
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="retention" fill="#3b82f6" name="Retention %" />
                <Bar dataKey="engagement" fill="#10b981" name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Key Insights
          </h4>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>• Videos with clear hooks retain 23% more viewers</li>
            <li>• Step-by-step format increases completion rate by 31%</li>
            <li>• Personal stories boost engagement in first 5 minutes</li>
            <li>• Optimal video length appears to be 8-12 minutes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAnalysis;
