
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Code, 
  Github, 
  GitMerge, 
  GitPullRequest, 
  Heart, 
  Search, 
  Star,
  Zap 
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ChatbotBubble } from "@/components/layout/ChatbotBubble";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  const [email, setEmail] = useState("");
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-hero-pattern py-16 md:py-24 text-white overflow-hidden relative">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
              <HeroBadge>Now in Beta</HeroBadge>
              
              <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter">
                Find the perfect open source issue to <GradientText>contribute to</GradientText>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 max-w-[700px]">
                Matching developers with open source projects based on skills, interests, and experience level. Start your open source journey today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button 
                  className="github-button gap-2 text-base h-12 px-6" 
                  size="lg"
                >
                  <Github className="h-5 w-5" />
                  Sign in with GitHub
                </Button>
                
                <Link to="/dashboard">
                  <Button variant="outline" className="gap-2 text-base h-12 px-6 border-white/20 bg-white/5 hover:bg-white/10 text-white">
                    <Search className="h-5 w-5" />
                    Browse Issues
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-2 mt-8 text-slate-300 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Trusted by over 5,000 developers</span>
              </div>
            </div>
          </div>
          
          {/* Custom wave shape divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-full h-16 md:h-24"
              fill="currentColor"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,130.83,141.14,214.86,113.86,255.14,101,296.05,83.36,321.39,56.44Z"
                className="fill-background"
              ></path>
            </svg>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Our platform uses AI to match you with open source issues that fit your skills and interests.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Code className="h-10 w-10 text-primary" />}
                title="Skill-Based Matching"
                description="Connect your GitHub account to analyze your skills and find issues that match your experience level."
              />
              
              <FeatureCard
                icon={<GitPullRequest className="h-10 w-10 text-primary" />}
                title="Curated Issues"
                description="Get personalized recommendations for issues across thousands of open source projects."
              />
              
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="AI Assistant"
                description="Get help understanding issues, finding resources, and planning your contributions."
              />
            </div>
          </div>
        </section>
        
        {/* Projects Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover popular open source projects looking for contributors just like you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project cards would go here - showing 3 examples */}
              <ProjectCard
                name="React"
                description="A JavaScript library for building user interfaces"
                language="JavaScript"
                stars={198000}
                issues={740}
              />
              
              <ProjectCard
                name="TensorFlow"
                description="An open source machine learning framework"
                language="Python"
                stars={167000}
                issues={1623}
              />
              
              <ProjectCard
                name="VS Code"
                description="Code editing. Redefined."
                language="TypeScript"
                stars={141000}
                issues={520}
              />
            </div>
            
            <div className="text-center mt-12">
              <Link to="/dashboard">
                <Button className="gap-2">
                  Explore All Projects
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-accent/5 border-y border-border">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">
                  Ready to start your open source journey?
                </h2>
                <p className="text-muted-foreground">
                  Join thousands of developers who are making meaningful contributions to open source projects every day.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button className="github-button gap-2">
                    <Github className="h-4 w-4" />
                    Sign in with GitHub
                  </Button>
                  
                  <div className="relative flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button 
                      className="absolute right-1 top-1 h-8 px-3 github-button"
                      onClick={() => setEmail("")}
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex justify-center">
                <div className="stats-card bg-card rounded-lg border border-border p-6 shadow-sm max-w-sm w-full">
                  <h3 className="font-semibold text-xl mb-4">Platform Statistics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-md">
                      <p className="text-3xl font-bold text-primary">5.2K+</p>
                      <p className="text-sm text-muted-foreground">Developers</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-md">
                      <p className="text-3xl font-bold text-primary">12K+</p>
                      <p className="text-sm text-muted-foreground">Matched Issues</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-md">
                      <p className="text-3xl font-bold text-primary">850+</p>
                      <p className="text-sm text-muted-foreground">Projects</p>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/50 rounded-md">
                      <p className="text-3xl font-bold text-primary">3.7K+</p>
                      <p className="text-sm text-muted-foreground">Contributions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Loved by Developers
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Hear from our community of contributors who found their open source match.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                quote="This platform helped me find my first real open source contribution. The issue matching is spot on!"
                name="Alex Johnson"
                role="Frontend Developer"
                avatar="https://github.com/ghost.png"
              />
              
              <TestimonialCard
                quote="I was looking for good first issues in React projects, and this tool made it so easy to find the perfect match."
                name="Samantha Lee"
                role="UI/UX Designer"
                avatar="https://github.com/ghost.png"
              />
              
              <TestimonialCard
                quote="The AI assistant helped me understand the issue and guided me through making my first PR. Amazing experience!"
                name="Michael Chen"
                role="CS Student"
                avatar="https://github.com/ghost.png"
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center">
                <GitMerge className="h-6 w-6 text-accent mr-2" />
                <span className="text-lg font-semibold">OSContrib</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting developers with open source projects that matter.
              </p>
              <div className="flex space-x-3">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Dashboard</a></li>
                <li><a href="#" className="hover:text-foreground">Issue Matching</a></li>
                <li><a href="#" className="hover:text-foreground">AI Assistant</a></li>
                <li><a href="#" className="hover:text-foreground">Contribution Tracker</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">Getting Started</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
                <li><a href="#" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2023 Open Source Contribution Matchmaker. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      <ChatbotBubble />
    </div>
  );
}

// Components

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
      {children}
    </span>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 github-card">
      <div className="mb-4 rounded-full bg-primary/10 p-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function ProjectCard({
  name,
  description,
  language,
  stars,
  issues,
}: {
  name: string;
  description: string;
  language: string;
  stars: number;
  issues: number;
}) {
  return (
    <div className="p-6 github-card hover-scale">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="text-sm">{stars.toLocaleString()}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          {language}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {issues} open issues
        </span>
      </div>
    </div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  avatar,
}: {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}) {
  return (
    <div className="p-6 github-card hover-scale">
      <div className="flex justify-center mb-4">
        <Heart className="h-6 w-6 text-red-500" />
      </div>
      <p className="text-center mb-6 text-balance">{quote}</p>
      <div className="flex items-center justify-center">
        <img 
          src={avatar} 
          alt={name} 
          className="w-10 h-10 rounded-full border border-border mr-3"
        />
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}
