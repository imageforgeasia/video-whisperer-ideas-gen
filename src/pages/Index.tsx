
import { useState } from "react";
import { Search, TrendingUp, FileText, Lightbulb, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import VideoResults from "@/components/VideoResults";
import ContentAnalysis from "@/components/ContentAnalysis";
import ScriptSuggestions from "@/components/ScriptSuggestions";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    console.log("Searching for:", searchQuery);
    
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      setHasResults(true);
    }, 2000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">YouTube Content Analyzer</h1>
                  <p className="text-gray-600">Discover successful content patterns and generate winning scripts</p>
                </div>
              </div>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user?.email?.split('@')[0] || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-red-600" />
                Search YouTube Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <Input
                  placeholder="Enter your keyword (e.g., 'AI tutorial', 'fitness workout')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isSearching}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isSearching ? "Analyzing..." : "Analyze Content"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          {hasResults && (
            <div className="space-y-8">
              {/* Current Search Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  Results for: "{searchQuery}"
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Top 5 Videos Analyzed
                </Badge>
              </div>

              {/* Video Results */}
              <VideoResults searchQuery={searchQuery} />

              {/* Content Analysis */}
              <div className="grid lg:grid-cols-2 gap-8">
                <ContentAnalysis />
                <ScriptSuggestions searchQuery={searchQuery} />
              </div>
            </div>
          )}

          {/* Getting Started Info */}
          {!hasResults && (
            <div className="text-center py-16">
              <div className="mx-auto max-w-md">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Ready to Analyze YouTube Content?
                </h3>
                <p className="mt-2 text-gray-600">
                  Enter a keyword above to discover what's working in your niche and get AI-powered script suggestions.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span>Analyzes top 5 search results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span>Extracts successful content patterns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Generates custom script ideas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
