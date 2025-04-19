import { useState } from "react";
import { BookOpen, CircleUser, Clock, Sparkles, Star, Zap } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Issue = {
  id: string;
  title: string;
  repo: {
    name: string;
    owner: string;
    stars: number;
  };
  tags: string[];
  matchScore: number;
  createdAt: string;
  matchReasons: string[];
  language: string;
  experience: "beginner" | "intermediate" | "advanced";
};

type IssueCardProps = {
  issue: Issue;
};

export function IssueCard({ issue }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 30 
      ? date.toLocaleDateString() 
      : `${diffDays} days ago`;
  };
  
  const getMatchScoreClass = (score: number) => {
    if (score >= 80) return "match-score-high";
    if (score >= 50) return "match-score-medium";
    return "match-score-low";
  };
  
  const getExperienceLevel = (level: string) => {
    switch (level) {
      case "beginner":
        return { text: "Beginner Friendly", icon: <BookOpen className="h-3 w-3" /> };
      case "intermediate":
        return { text: "Intermediate", icon: <CircleUser className="h-3 w-3" /> };
      case "advanced":
        return { text: "Advanced", icon: <Sparkles className="h-3 w-3" /> };
      default:
        return { text: level, icon: <CircleUser className="h-3 w-3" /> };
    }
  };
  
  const experienceInfo = getExperienceLevel(issue.experience);

  return (
    <Card className="hover-scale">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{issue.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span>{issue.repo.owner}/{issue.repo.name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center ml-2 text-muted-foreground">
                      <Star className="h-3 w-3 mr-0.5" />
                      <span className="text-xs">{issue.repo.stars.toLocaleString()}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Repository stars</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardDescription>
          </div>
          <Badge className={getMatchScoreClass(issue.matchScore)}>
            {issue.matchScore}% Match
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {issue.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mb-2 gap-3">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(issue.createdAt)}</span>
          </div>
          
          <div className="flex items-center">
            {experienceInfo.icon}
            <span className="ml-1">{experienceInfo.text}</span>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            {issue.language}
          </Badge>
        </div>
        
        {expanded && (
          <div className="mt-3 border-t border-border pt-3 animate-fade-in">
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Zap className="h-4 w-4 mr-1 text-primary" />
              Why We Matched This Issue
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              {issue.matchReasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "Why Matched?"}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">
            Save
          </Button>
          <Button className="github-button text-xs" size="sm">
            View Issue
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
