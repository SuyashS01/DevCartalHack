
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Code, 
  GitFork, 
  Github, 
  Layers, 
  LayoutDashboard, 
  Lightbulb, 
  Sparkles, 
  Tag, 
  User, 
  X 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

// Mock data for user profile
const mockUser = {
  name: "Jane Doe",
  username: "jane-dev",
  avatarUrl: "https://github.com/ghost.png",
  joinedDate: "2020-05-15",
  skills: ["JavaScript", "React", "Node.js", "TypeScript"]
};

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  // State for filters
  const [experienceLevel, setExperienceLevel] = useState([50]);
  const [showGoodFirstIssues, setShowGoodFirstIssues] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["JavaScript", "TypeScript"]);
  
  // Toggle language selection
  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };
  
  // Languages to filter by
  const languages = [
    "JavaScript", "TypeScript", "Python", "Rust", "Go", "Java", "C#", "PHP"
  ];

  return (
    <>
      {/* Sidebar backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card transform transition-transform duration-300 ease-in-out overflow-y-auto md:sticky md:top-16 md:h-[calc(100vh-4rem)] ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Mobile close button */}
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* User Profile Section */}
          <div className="flex flex-col items-center py-4 space-y-2">
            <div className="relative">
              <img 
                src={mockUser.avatarUrl} 
                alt={mockUser.name} 
                className="w-20 h-20 rounded-full border-2 border-border"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-500 border-2 border-card"></div>
            </div>
            <h3 className="text-lg font-medium">{mockUser.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Github className="w-3.5 h-3.5 mr-1" />
              <span>{mockUser.username}</span>
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {mockUser.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Filters */}
          <div className="space-y-5">
            <h3 className="text-sm font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-accent" />
              Experience Level
            </h3>
            <div className="px-2">
              <Slider
                defaultValue={experienceLevel}
                max={100}
                step={1}
                onValueChange={setExperienceLevel}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Beginner</span>
                <span>Advanced</span>
              </div>
            </div>
            
            <h3 className="text-sm font-medium flex items-center mt-4">
              <Lightbulb className="h-4 w-4 mr-2 text-accent" />
              Good First Issues
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm">Show beginner-friendly</span>
              <Switch
                checked={showGoodFirstIssues}
                onCheckedChange={setShowGoodFirstIssues}
              />
            </div>
            
            <h3 className="text-sm font-medium flex items-center mt-4">
              <Code className="h-4 w-4 mr-2 text-accent" />
              Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <Badge
                  key={language}
                  variant={selectedLanguages.includes(language) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => toggleLanguage(language)}
                >
                  {language}
                </Badge>
              ))}
            </div>
            
            <h3 className="text-sm font-medium flex items-center mt-4">
              <Layers className="h-4 w-4 mr-2 text-accent" />
              Project Size
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:opacity-80">Small</Badge>
              <Badge variant="default" className="cursor-pointer hover:opacity-80">Medium</Badge>
              <Badge variant="outline" className="cursor-pointer hover:opacity-80">Large</Badge>
            </div>
            
            <h3 className="text-sm font-medium flex items-center mt-4">
              <Tag className="h-4 w-4 mr-2 text-accent" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="cursor-pointer hover:opacity-80">Documentation</Badge>
              <Badge variant="outline" className="cursor-pointer hover:opacity-80">Bug</Badge>
              <Badge variant="outline" className="cursor-pointer hover:opacity-80">Feature</Badge>
              <Badge variant="outline" className="cursor-pointer hover:opacity-80">UI/UX</Badge>
            </div>
          </div>
          
          <div className="mt-auto pt-4">
            <Button className="w-full github-button">Apply Filters</Button>
          </div>
        </div>
      </aside>
    </>
  );
}
