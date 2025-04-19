
import { useState } from "react";
import { BellRing, Filter, GitMerge, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { IssueGrid } from "@/components/dashboard/IssueGrid";
import { ChatbotBubble } from "@/components/layout/ChatbotBubble";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <main className="flex-1">
          {/* Search and Filters */}
          <div className="border-b border-border/40 sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-4 px-4 md:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex w-full items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                      className="w-full bg-background pl-9"
                      placeholder="Search issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Filters</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <GitMerge className="h-3.5 w-3.5" />
                    <span className="sr-only md:not-sr-only">Sort</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <BellRing className="h-3.5 w-3.5" />
                    <span className="sr-only md:not-sr-only">Notifications</span>
                  </Button>
                  
                  <div className="border-l border-border h-6 mx-1 hidden md:block" />
                  
                  <div className="flex bg-muted/40 p-0.5 rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-8 w-8"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Issues Grid/List */}
          <div className="container py-8 px-4 md:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Recommended Issues
                </h1>
                <Badge variant="outline">
                  43 matches
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Based on your skills, these issues might be a good fit for you.
              </p>
            </div>
            
            <IssueGrid />
          </div>
        </main>
      </div>
      
      <ChatbotBubble />
    </div>
  );
}

// Components
function Search({ className, ...props }: React.ComponentProps<typeof SlidersHorizontal>) {
  return (
    <SlidersHorizontal className={className} {...props} />
  );
}

// Using the Badge component imported from ui/badge
import { Badge } from "@/components/ui/badge";
