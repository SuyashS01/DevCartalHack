
import { useState } from "react";
import { Link } from "react-router-dom";
import { GitFork, Github, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Toggle for mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Mock login function - would connect to GitHub OAuth in production
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 md:container md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <GitFork className="h-6 w-6 text-accent mr-2" />
              <span className="text-lg font-semibold hidden sm:inline-block">OSContrib</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:items-center md:space-x-4">
              <Link to="/" className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors">
                Dashboard
              </Link>
              <Link to="/contributions" className="text-foreground/80 hover:text-foreground px-3 py-2 transition-colors">
                Contributions
              </Link>
            </div>
          </div>
          
          {/* Right Side Elements */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button variant="default" className="gap-2">
                  <span className="hidden sm:inline-block">Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Button onClick={handleLogin} className="github-button gap-2">
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline-block">Sign in with GitHub</span>
              </Button>
            )}
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border/40 animate-fade-in">
          <div className="space-y-1 px-4 py-3">
            <Link to="/" 
              className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link to="/dashboard" 
              className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link to="/contributions" 
              className="block px-3 py-2 text-foreground/80 hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contributions
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
