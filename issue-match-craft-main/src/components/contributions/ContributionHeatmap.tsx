
import { useState } from "react";
import { GitCommit, GitMerge, GitPullRequest } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for the heatmap
const generateMockHeatmapData = () => {
  const days = 365;
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    
    // Generate some random contribution count (more likely to be 0)
    const count = Math.random() > 0.75 ? Math.floor(Math.random() * 10) : 0;
    
    data.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }
  
  return data;
};

const heatmapData = generateMockHeatmapData();

export function ContributionHeatmap() {
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);
  
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count < 3) return "bg-green-800/20";
    if (count < 5) return "bg-green-800/40";
    if (count < 8) return "bg-green-800/60";
    return "bg-green-800/80";
  };
  
  // Group data by weeks
  const weeks: Array<Array<typeof heatmapData[0]>> = [];
  let currentWeek: typeof heatmapData = [];
  
  heatmapData.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    
    currentWeek.push(day);
    
    // Add the remaining days of the last week
    if (index === heatmapData.length - 1) {
      weeks.push([...currentWeek]);
    }
  });
  
  // Pad the first week with empty days if needed
  const firstDayOfWeek = new Date(heatmapData[0].date).getDay();
  if (firstDayOfWeek > 0) {
    const emptyDays = Array(firstDayOfWeek).fill(null);
    weeks[0] = [...emptyDays, ...weeks[0]];
  }

  // Generate labels for days of week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="p-4 github-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Contribution Activity</h3>
        <p className="text-muted-foreground text-sm">
          {heatmapData.filter(d => d.count > 0).length} contributions in the last year
        </p>
      </div>
      
      <div className="flex text-xs text-muted-foreground mb-1 ml-9">
        {/* Month labels */}
        <span className="w-1/12">Jan</span>
        <span className="w-1/12">Feb</span>
        <span className="w-1/12">Mar</span>
        <span className="w-1/12">Apr</span>
        <span className="w-1/12">May</span>
        <span className="w-1/12">Jun</span>
        <span className="w-1/12">Jul</span>
        <span className="w-1/12">Aug</span>
        <span className="w-1/12">Sep</span>
        <span className="w-1/12">Oct</span>
        <span className="w-1/12">Nov</span>
        <span className="w-1/12">Dec</span>
      </div>
      
      <div className="flex">
        {/* Day of week labels */}
        <div className="flex flex-col justify-around text-xs text-muted-foreground pr-1 h-[120px]">
          {daysOfWeek.map((day, i) => (
            i % 2 === 0 && <span key={day}>{day}</span>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="flex-1 overflow-hidden overflow-x-auto">
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => (
                  <TooltipProvider key={`${weekIndex}-${dayIndex}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={`w-3 h-3 rounded-sm ${day ? getColorClass(day.count) : 'bg-transparent'}`}
                        />
                      </TooltipTrigger>
                      {day && (
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">{day.count} contributions</p>
                            <p className="text-muted-foreground">{new Date(day.date).toLocaleDateString()}</p>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8 border-t border-border pt-4">
        <div className="flex space-x-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground">
              <GitPullRequest className="w-4 h-4 mr-1" />
              <span className="text-sm">PRs</span>
            </div>
            <p className="text-lg font-semibold">24</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground">
              <GitMerge className="w-4 h-4 mr-1" />
              <span className="text-sm">Merged</span>
            </div>
            <p className="text-lg font-semibold">18</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center text-muted-foreground">
              <GitCommit className="w-4 h-4 mr-1" />
              <span className="text-sm">Commits</span>
            </div>
            <p className="text-lg font-semibold">132</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="w-3 h-3 bg-muted rounded-sm"></div>
          <div className="w-3 h-3 bg-green-800/20 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-800/40 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-800/60 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-800/80 rounded-sm"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
