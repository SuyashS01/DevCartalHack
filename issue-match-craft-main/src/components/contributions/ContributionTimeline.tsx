
import { CheckCircle, GitCommit, GitPullRequest, Hourglass } from "lucide-react";

// Mock data for contribution timeline
const timelineData = [
  {
    id: 1,
    type: "pull-request",
    title: "Add dark mode toggle to settings page",
    repo: "acme/design-system",
    status: "merged",
    date: "2023-04-10",
    commits: 3,
    additions: 120,
    deletions: 42,
  },
  {
    id: 2,
    type: "issue",
    title: "Fix navigation menu overflow on mobile",
    repo: "acme/website",
    status: "open",
    date: "2023-04-03",
    comments: 5,
  },
  {
    id: 3,
    type: "pull-request",
    title: "Update README with new installation instructions",
    repo: "open-source/docs",
    status: "merged",
    date: "2023-03-25",
    commits: 1,
    additions: 45,
    deletions: 12,
  },
  {
    id: 4,
    type: "pull-request",
    title: "Implement login form validation",
    repo: "open-source/auth",
    status: "open",
    date: "2023-03-20",
    commits: 4,
    additions: 188,
    deletions: 24,
  },
  {
    id: 5,
    type: "issue",
    title: "Improve loading state for data tables",
    repo: "acme/components",
    status: "closed",
    date: "2023-03-15",
    comments: 8,
  },
];

export function ContributionTimeline() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "merged":
        return <CheckCircle className="h-4 w-4 text-match-high" />;
      case "open":
        return <Hourglass className="h-4 w-4 text-primary" />;
      case "closed":
        return <CheckCircle className="h-4 w-4 text-match-medium" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "merged":
        return "Merged";
      case "open":
        return "Open";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pull-request":
        return <GitPullRequest className="h-4 w-4" />;
      case "issue":
        return <GitCommit className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 github-card">
      <h3 className="text-lg font-semibold mb-4">Recent Contributions</h3>
      
      <div className="space-y-4">
        {timelineData.map((item) => (
          <div key={item.id} className="border-l-2 pl-4 pb-5 relative border-border/70 last:pb-0">
            {/* Timeline node */}
            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center">
              {getTypeIcon(item.type)}
            </div>
            
            {/* Content */}
            <div className="hover-scale">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-medium hover:text-primary">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.repo} • {formatDate(item.date)}
                  </p>
                </div>
                <div className="flex items-center bg-muted/50 rounded-full px-2 py-0.5 text-xs">
                  {getStatusIcon(item.status)}
                  <span className="ml-1">{getStatusText(item.status)}</span>
                </div>
              </div>
              
              {/* Additional metadata based on type */}
              {item.type === "pull-request" && (
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <GitCommit className="h-3 w-3 mr-1" />
                    <span>{item.commits} commits</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-match-high mr-1">+{item.additions}</span>
                    <span className="text-match-low">-{item.deletions}</span>
                  </div>
                </div>
              )}
              
              {item.type === "issue" && item.comments > 0 && (
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <span>{item.comments} comments</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
