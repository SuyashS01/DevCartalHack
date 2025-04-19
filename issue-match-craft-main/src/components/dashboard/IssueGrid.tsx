
import { Issue, IssueCard } from "@/components/dashboard/IssueCard";

// Mock data for issues
const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Fix responsive layout in dashboard component",
    repo: {
      name: "react-ui-library",
      owner: "open-source-org",
      stars: 2432,
    },
    tags: ["bug", "ui", "responsive", "good-first-issue"],
    matchScore: 92,
    createdAt: "2023-04-01",
    matchReasons: [
      "Matches your React and CSS skills",
      "Repo language matches your preferred language",
      "Similar to issues you've fixed before",
      "Beginner-friendly tag matches your preferences"
    ],
    language: "TypeScript",
    experience: "beginner",
  },
  {
    id: "2",
    title: "Optimize database queries for user dashboard",
    repo: {
      name: "node-api",
      owner: "backend-tools",
      stars: 8730,
    },
    tags: ["performance", "database", "node.js"],
    matchScore: 85,
    createdAt: "2023-04-05",
    matchReasons: [
      "Matches your Node.js skills",
      "You've shown interest in performance optimizations",
      "Project size fits your preferred scope",
      "Technology stack aligns with your experience"
    ],
    language: "JavaScript",
    experience: "intermediate",
  },
  {
    id: "3",
    title: "Add unit tests for authentication service",
    repo: {
      name: "auth-service",
      owner: "cloud-company",
      stars: 1204,
    },
    tags: ["testing", "authentication", "jest"],
    matchScore: 78,
    createdAt: "2023-04-10",
    matchReasons: [
      "Matches your interests in testing",
      "Works with technologies you've used before",
      "Project has good documentation"
    ],
    language: "TypeScript",
    experience: "intermediate",
  },
  {
    id: "4",
    title: "Implement dark mode theme toggle",
    repo: {
      name: "design-system",
      owner: "ui-frameworks",
      stars: 5629,
    },
    tags: ["feature", "theming", "css", "react"],
    matchScore: 88,
    createdAt: "2023-04-08",
    matchReasons: [
      "Matches your React.js experience",
      "You've worked on similar UI features",
      "Aligns with your CSS/styling skills",
      "Project is actively maintained"
    ],
    language: "TypeScript",
    experience: "beginner",
  },
  {
    id: "5",
    title: "Fix memory leak in web worker implementation",
    repo: {
      name: "progressive-web-app",
      owner: "web-performance",
      stars: 3201,
    },
    tags: ["bug", "performance", "memory-leak"],
    matchScore: 65,
    createdAt: "2023-04-12",
    matchReasons: [
      "Matches your JavaScript debugging skills",
      "Project tech stack is familiar to you",
      "Opportunity to learn about web workers"
    ],
    language: "JavaScript",
    experience: "advanced",
  },
  {
    id: "6",
    title: "Improve documentation for API endpoints",
    repo: {
      name: "rest-api",
      owner: "api-platform",
      stars: 952,
    },
    tags: ["documentation", "api", "good-first-issue"],
    matchScore: 90,
    createdAt: "2023-04-15",
    matchReasons: [
      "Documentation tasks match your preferences",
      "Beginner-friendly issue for this project",
      "Aligns with your technical writing skills",
      "Project in active development phase"
    ],
    language: "Markdown",
    experience: "beginner",
  },
];

export function IssueGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mockIssues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}
