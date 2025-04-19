
import { CalendarClock, FileCheck, GitCommit, GitPullRequest, List, LayoutGrid, Star, History } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { ContributionHeatmap } from "@/components/contributions/ContributionHeatmap";
import { ContributionTimeline } from "@/components/contributions/ContributionTimeline";
import { ChatbotBubble } from "@/components/layout/ChatbotBubble";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function Contributions() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/40 bg-muted/30 py-8">
          <div className="container px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Your Contributions
                </h1>
                <p className="text-muted-foreground">
                  Track your open source journey and see your impact.
                </p>
              </div>
              
              <div className="flex space-x-4 items-start">
                <Button className="github-button gap-2">
                  <GitPullRequest className="h-4 w-4" />
                  New Contribution
                </Button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <StatCard 
                title="Pull Requests" 
                value="24" 
                icon={<GitPullRequest className="h-5 w-5 text-primary" />} 
              />
              
              <StatCard 
                title="Commits" 
                value="132" 
                icon={<GitCommit className="h-5 w-5 text-primary" />} 
              />
              
              <StatCard 
                title="Repositories" 
                value="18" 
                icon={<FileCheck className="h-5 w-5 text-primary" />} 
              />
              
              <StatCard 
                title="Stars Earned" 
                value="73" 
                icon={<Star className="h-5 w-5 text-yellow-500" />} 
              />
            </div>
          </div>
        </section>
        
        {/* Content */}
        <section className="py-8">
          <div className="container px-4 md:px-6 lg:px-8">
            <Tabs defaultValue="activity">
              <div className="flex justify-between items-center mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="activity" className="gap-2">
                    <CalendarClock className="h-4 w-4" />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="gap-2">
                    <History className="h-4 w-4" />
                    <span className="hidden sm:inline">Timeline</span>
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="gap-2">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">Projects</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    This Month
                  </Button>
                </div>
              </div>
              
              <TabsContent value="activity" className="space-y-8">
                <ContributionHeatmap />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="github-card p-4">
                    <h3 className="text-lg font-semibold mb-4">Top Languages</h3>
                    <div className="space-y-3">
                      <LanguageBar language="JavaScript" percentage={45} color="yellow" />
                      <LanguageBar language="TypeScript" percentage={30} color="blue" />
                      <LanguageBar language="CSS" percentage={15} color="purple" />
                      <LanguageBar language="HTML" percentage={10} color="red" />
                    </div>
                  </div>
                  
                  <div className="github-card p-4">
                    <h3 className="text-lg font-semibold mb-4">Contribution Badges</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Badge name="First PR" icon="🎉" description="Made your first pull request" />
                      <Badge name="Bug Hunter" icon="🐛" description="Fixed 5+ bugs" />
                      <Badge name="Documentation" icon="📚" description="Improved project docs" />
                      <Badge name="Feature Dev" icon="✨" description="Added new features" />
                      <Badge name="Reviewer" icon="👀" description="Reviewed 10+ PRs" />
                      <Badge name="Good First Issue" icon="🌱" description="Helped beginners" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="timeline">
                <ContributionTimeline />
              </TabsContent>
              
              <TabsContent value="projects">
                <div className="github-card p-4">
                  <h3 className="text-lg font-semibold mb-4">Your Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProjectItem 
                      name="react-ui-library" 
                      owner="open-source-org" 
                      contributions={8} 
                      language="TypeScript" 
                    />
                    <ProjectItem 
                      name="node-api" 
                      owner="backend-tools" 
                      contributions={5} 
                      language="JavaScript" 
                    />
                    <ProjectItem 
                      name="design-system" 
                      owner="ui-frameworks" 
                      contributions={3} 
                      language="CSS" 
                    />
                    <ProjectItem 
                      name="docs" 
                      owner="open-source" 
                      contributions={2} 
                      language="Markdown" 
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <ChatbotBubble />
    </div>
  );
}

// Components

function StatCard({ 
  title, 
  value, 
  icon 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
}) {
  return (
    <div className="github-card p-4 flex flex-col">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

function LanguageBar({ 
  language, 
  percentage, 
  color 
}: { 
  language: string; 
  percentage: number; 
  color: string; 
}) {
  // Map color names to tailwind classes
  const colorMap: Record<string, string> = {
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    purple: "bg-purple-500",
  };
  
  const bgColorClass = colorMap[color] || "bg-primary";
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{language}</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <div className="w-full bg-muted/40 rounded-full h-2">
        <div 
          className={`${bgColorClass} h-2 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function Badge({ 
  name, 
  icon, 
  description 
}: { 
  name: string; 
  icon: string; 
  description: string; 
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <span className="text-sm font-medium">{name}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>
  );
}

function ProjectItem({ 
  name, 
  owner, 
  contributions, 
  language 
}: { 
  name: string; 
  owner: string; 
  contributions: number; 
  language: string; 
}) {
  return (
    <div className="border border-border rounded-lg p-3 hover-scale">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium">{owner}/{name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-muted/60 px-2 py-0.5 rounded">
              {language}
            </span>
            <span className="text-xs text-muted-foreground">
              {contributions} contributions
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <GitPullRequest className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
