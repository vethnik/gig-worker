import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, MapPin, CheckCircle, TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const STATS = [
  { value: "10K+", label: "Skilled Workers", icon: Users, color: "text-primary" },
  { value: "5K+", label: "Active Jobs", icon: Briefcase, color: "text-accent" },
  { value: "50+", label: "Cities Covered", icon: MapPin, color: "text-rose-500" },
];

const TICKER_ITEMS = [
  "🔨 Carpenter needed in Chennai",
  "⚡ Electrician • Mumbai",
  "🧱 Mason • Delhi",
  "🪠 Plumber • Bangalore",
  "🏗️ Site Supervisor • Hyderabad",
  "🌿 Landscaper • Pune",
  "🏠 Household Help • Kolkata",
  "🚛 Loader/Unloader • Ahmedabad",
];

const Hero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language;

  React.useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">

      {/* Background geometric shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large orange blob top-right */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.07] dark:opacity-[0.05]"
          style={{ background: 'hsl(28 95% 52%)' }} />
        {/* Smaller teal blob bottom-left */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-[0.06] dark:opacity-[0.04]"
          style={{ background: 'hsl(195 80% 42%)' }} />
        {/* Grid dots */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(20 25% 20%) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
      </div>

      {/* Main hero content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
                <Zap className="w-3.5 h-3.5" />
                India's Blue-Collar Job Platform
              </div>

              <h1 className={`hero-title font-black text-foreground mb-6 animate-fade-in lang-${currentLang}`}
                style={{ animationDelay: '0.1s', fontFamily: 'Syne, sans-serif', letterSpacing: '-0.03em' }}>
                {t('hero_title_1')}
                <span className="block text-gradient-orange mt-1">
                  {t('hero_title_2')}
                </span>
              </h1>

              <p className={`hero-description text-muted-foreground mb-10 max-w-lg animate-fade-in lang-${currentLang}`}
                style={{ animationDelay: '0.2s' }}>
                {t('hero_description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all px-8 gap-2 text-base"
                  asChild
                >
                  <a href="/jobs">
                    {t('find_jobs_near_you')}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 hover:bg-muted px-8 text-base"
                  onClick={() => navigate('/jobs?action=post-job')}
                >
                  {t('post_job')}
                </Button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {["Free to join", "Instant matching", "Verified employers"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual cards */}
            <div className="hidden lg:block relative h-[520px] animate-fade-in" style={{ animationDelay: '0.5s' }}>

              {/* Center large card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-card border border-border rounded-2xl p-6 shadow-xl z-20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>Site Supervisor</p>
                    <p className="text-sm text-muted-foreground">BuildCorp India</p>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-card-foreground">Chennai, TN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wage</span>
                    <span className="font-bold text-primary">₹800/day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">Contract</span>
                  </div>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm">Apply Now →</Button>
              </div>

              {/* Top-left floating card */}
              <div className="absolute top-4 left-0 w-56 bg-card border border-border rounded-xl p-4 shadow-lg z-10 animate-float">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-semibold text-card-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>New Match!</span>
                </div>
                <p className="text-xs text-muted-foreground">Ravi Kumar • Mason</p>
                <p className="text-xs text-muted-foreground">12 yrs exp • Coimbatore</p>
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-1 rounded-full bg-primary" />)}
                </div>
              </div>

              {/* Bottom-right floating card */}
              <div className="absolute bottom-12 right-0 w-52 bg-card border border-border rounded-xl p-4 shadow-lg z-10 animate-float-slow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-rose-500" />
                  </div>
                  <span className="text-sm font-semibold text-card-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>Live Stats</span>
                </div>
                <p className="text-xs text-muted-foreground">Jobs posted today</p>
                <p className="text-2xl font-black text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>1,247</p>
                <p className="text-xs text-green-500 font-medium">↑ 18% from yesterday</p>
              </div>

              {/* Top-right mini badge */}
              <div className="absolute top-20 right-4 bg-primary text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg animate-bounce-gentle z-30">
                🔥 94% Match Rate
              </div>

              {/* Decorative ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-dashed border-primary/15 z-0 animate-rotate-slow" />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all card-hover">
                <Icon className={`w-6 h-6 ${color} mx-auto mb-3`} />
                <p className="text-3xl font-black text-foreground mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <div className="relative z-10 bg-primary/8 border-y border-primary/15 py-3 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap gap-8">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-sm font-medium text-muted-foreground px-6 shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
