import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language;
  
  // Update document lang attribute for proper CSS targeting
  React.useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const handlePostJobClick = () => {
    try {
      navigate('/jobs?action=post-job');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location
      window.location.href = '/jobs?action=post-job';
    }
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
      
      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <h1 className={`hero-title font-bold text-foreground mb-6 animate-fade-in lang-${currentLang}`} style={{textShadow: '0 0 40px hsl(var(--primary) / 0.5)'}}>
              {t('hero_title_1')}
              <span className={`hero-subtitle block text-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text mt-2 lang-${currentLang}`}>
                {t('hero_title_2')}
              </span>
            </h1>
            
            <p className={`hero-description text-muted-foreground mb-8 max-w-2xl animate-fade-in lang-${currentLang}`} style={{animationDelay: '0.2s'}}>
              {t('hero_description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6" 
                asChild
              >
                <a href="/jobs">
                  {t('find_jobs_near_you')}
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6" 
                onClick={handlePostJobClick}
              >
                {t('post_job')}
              </Button>
            </div>
          </div>
          
          {/* Right Side - Interactive Network Visualization */}
          <div className="relative h-[500px] hidden lg:block animate-fade-in" style={{animationDelay: '0.6s'}}>
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full gap-4">
                {Array.from({length: 64}).map((_, i) => (
                  <div key={i} className="bg-primary/20 rounded-sm animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>
            </div>

            {/* Network Nodes */}
            <div className="absolute top-16 left-16 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <div className="absolute top-32 right-20 w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            
            <div className="absolute bottom-24 left-20 w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center shadow-lg animate-float-slow" style={{animationDelay: '1s'}}>
              <MapPin className="w-7 h-7 text-primary-foreground" />
            </div>
            
            <div className="absolute top-1/2 right-8 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle" style={{animationDelay: '1.5s'}}>
              <Star className="w-5 h-5 text-primary-foreground" />
            </div>

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 1}}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path d="M 80 80 Q 200 150 320 160" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
              <path d="M 320 160 Q 400 200 380 280" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              <path d="M 380 280 Q 300 350 120 320" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '1s'}} />
              <path d="M 120 320 Q 50 250 80 80" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '1.5s'}} />
            </svg>

            {/* Floating Data Cards */}
            <div className="absolute top-8 right-8 bg-card/90 backdrop-blur-md border border-border rounded-xl p-3 shadow-elegant animate-float" style={{animationDelay: '0.3s'}}>
              <div className="text-xs text-muted-foreground">Active Now</div>
              <div className="text-lg font-bold text-card-foreground">2,847</div>
              <div className="text-xs text-green-500">+12% ↗</div>
            </div>

            <div className="absolute bottom-8 right-16 bg-card/90 backdrop-blur-md border border-border rounded-xl p-3 shadow-elegant animate-float-slow" style={{animationDelay: '0.8s'}}>
              <div className="text-xs text-muted-foreground">Jobs Posted</div>
              <div className="text-lg font-bold text-card-foreground">1,234</div>
              <div className="text-xs text-blue-500">Today</div>
            </div>

            <div className="absolute top-1/3 left-8 bg-card/90 backdrop-blur-md border border-border rounded-xl p-3 shadow-elegant animate-bounce-gentle" style={{animationDelay: '1.2s'}}>
              <div className="text-xs text-muted-foreground">Success Rate</div>
              <div className="text-lg font-bold text-card-foreground">94.2%</div>
              <div className="text-xs text-purple-500">Excellent</div>
            </div>

            {/* Animated Orbs */}
            <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-primary/30 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-accent/40 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
            <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-secondary/35 rounded-full animate-ping" style={{animationDelay: '1.1s'}}></div>
            
            {/* Floating Numbers */}
            <div className="absolute top-12 left-1/2 text-primary/60 font-mono text-sm animate-float" style={{animationDelay: '0.4s'}}>10K+</div>
            <div className="absolute bottom-16 left-1/3 text-accent/60 font-mono text-sm animate-float-slow" style={{animationDelay: '0.9s'}}>5K+</div>
            <div className="absolute top-2/3 right-1/5 text-secondary/60 font-mono text-sm animate-bounce-gentle" style={{animationDelay: '1.3s'}}>50+</div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{animationDelay: '0.8s'}}>
          <div 
            className="text-center p-8 rounded-3xl backdrop-blur-glass border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-neon-blue bg-card"
          >
            <div className="w-16 h-16 bg-muted backdrop-blur-glass rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-4xl font-bold text-card-foreground mb-2">10K+</h3>
            <p className="text-muted-foreground">{t('skilled_workers')}</p>
          </div>
          
          <div 
            className="text-center p-8 rounded-3xl backdrop-blur-glass border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-neon-purple bg-card"
          >
            <div className="w-16 h-16 bg-muted backdrop-blur-glass rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
              <Briefcase className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-4xl font-bold text-card-foreground mb-2">5K+</h3>
            <p className="text-muted-foreground">{t('active_jobs')}</p>
          </div>
          
          <div 
            className="text-center p-8 rounded-3xl backdrop-blur-glass border border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-neon-pink bg-card"
          >
            <div className="w-16 h-16 bg-muted backdrop-blur-glass rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
              <MapPin className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-4xl font-bold text-card-foreground mb-2">50+</h3>
            <p className="text-muted-foreground">{t('cities_covered')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;