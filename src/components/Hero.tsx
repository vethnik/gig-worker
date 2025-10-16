import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, MapPin, CreditCard, Zap } from "lucide-react";
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
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
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
            <h1 className={`hero-title font-bold text-white mb-6 animate-fade-in lang-${currentLang}`} style={{textShadow: '0 0 40px rgba(66, 153, 255, 0.5)'}}>
              {t('hero_title_1')}
              <span className={`hero-subtitle block text-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text mt-2 lang-${currentLang}`}>
                {t('hero_title_2')}
              </span>
            </h1>
            
            <p className={`hero-description text-white/80 mb-8 max-w-2xl animate-fade-in lang-${currentLang}`} style={{animationDelay: '0.2s'}}>
              {t('hero_description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white shadow-neon-blue hover:shadow-glow transition-all duration-300" 
                asChild
              >
                <a href="/jobs">
                  {t('find_jobs_near_you')}
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-white/10 backdrop-blur-glass border-2 border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300" 
                onClick={handlePostJobClick}
              >
                {t('post_job')}
              </Button>
            </div>
          </div>
          
          {/* Right Side - 3D Card Mockups */}
          <div className="relative h-[500px] hidden lg:block animate-fade-in" style={{animationDelay: '0.6s'}}>
            {/* Card 1 - Purple Blue */}
            <div 
              className="absolute top-0 left-0 w-80 h-48 rounded-3xl p-6 shadow-neon-purple transition-transform duration-500 hover:scale-105"
              style={{
                background: 'var(--gradient-card-1)',
                transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)',
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="text-white/80 text-sm font-medium">Worker Card</div>
                <CreditCard className="w-8 h-8 text-white/60" />
              </div>
              <div className="text-white/60 text-xs mb-2">Card Number</div>
              <div className="text-white text-lg font-mono tracking-wider">•••• •••• •••• 4829</div>
              <div className="flex justify-between mt-4">
                <div>
                  <div className="text-white/60 text-xs">Valid Thru</div>
                  <div className="text-white text-sm">12/25</div>
                </div>
                <div className="text-white text-xl font-bold">VISA</div>
              </div>
            </div>
            
            {/* Card 2 - Pink Red */}
            <div 
              className="absolute top-20 right-0 w-80 h-48 rounded-3xl p-6 shadow-neon-pink transition-transform duration-500 hover:scale-105"
              style={{
                background: 'var(--gradient-card-2)',
                transform: 'perspective(1000px) rotateY(10deg) rotateX(-3deg)',
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="text-white/80 text-sm font-medium">Premium</div>
                <Zap className="w-8 h-8 text-white/60" />
              </div>
              <div className="text-white/60 text-xs mb-2">Account Balance</div>
              <div className="text-white text-2xl font-bold">₹45,280</div>
              <div className="flex justify-between mt-4">
                <div>
                  <div className="text-white/60 text-xs">Active Jobs</div>
                  <div className="text-white text-lg font-bold">12</div>
                </div>
                <div className="text-white/80 text-xs">+18.5% this month</div>
              </div>
            </div>
            
            {/* Card 3 - Cyan Blue */}
            <div 
              className="absolute bottom-0 left-12 w-80 h-48 rounded-3xl p-6 shadow-neon-blue transition-transform duration-500 hover:scale-105"
              style={{
                background: 'var(--gradient-card-3)',
                transform: 'perspective(1000px) rotateY(-8deg) rotateX(8deg)',
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="text-white/80 text-sm font-medium">Quick Stats</div>
                <Briefcase className="w-8 h-8 text-white/60" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white/60 text-xs">Total Earnings</div>
                  <div className="text-white text-xl font-bold">₹2.4L</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs">Rating</div>
                  <div className="text-white text-xl font-bold">4.9 ★</div>
                </div>
              </div>
              <div className="mt-4 text-white/80 text-xs">Verified Professional Since 2023</div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{animationDelay: '0.8s'}}>
          <div 
            className="text-center p-8 rounded-3xl backdrop-blur-glass border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-neon-blue"
            style={{ background: 'var(--glass-bg)' }}
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-glass rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">10K+</h3>
            <p className="text-white/70">{t('skilled_workers')}</p>
          </div>
          
          <div 
            className="text-center p-8 rounded-3xl backdrop-blur-glass border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-neon-purple"
            style={{ background: 'var(--glass-bg)' }}
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-glass rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <Briefcase className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">5K+</h3>
            <p className="text-white/70">{t('active_jobs')}</p>
          </div>
          
          <div 
            className="text-center p-8 rounded-3xl backdrop-blur-glass border border-white/10 hover:border-secondary/50 transition-all duration-300 hover:shadow-neon-pink"
            style={{ background: 'var(--glass-bg)' }}
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-glass rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <MapPin className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">50+</h3>
            <p className="text-white/70">{t('cities_covered')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;