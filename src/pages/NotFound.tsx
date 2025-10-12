import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SearchX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4 max-w-2xl mx-auto">
        {/* Animated Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative bg-gradient-primary rounded-full p-8 animate-scale-in">
              <SearchX className="w-24 h-24 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="mb-4 text-8xl font-bold text-foreground animate-fade-in">
          404
        </h1>
        
        {/* Message */}
        <h2 className="mb-4 text-3xl font-semibold text-foreground animate-fade-in">
          Oops! Page Not Found
        </h2>
        <p className="mb-8 text-xl text-muted-foreground animate-fade-in">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button variant="hero" size="lg" asChild>
            <a href="/" className="gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </a>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
