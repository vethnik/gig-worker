import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Briefcase, Shield, Clock, Star, TrendingUp, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: Users,
    title: "Verified Professionals",
    desc: "All workers are background-checked and skill-verified for your peace of mind.",
    accent: "bg-primary/10 text-primary",
    border: "hover:border-primary/40",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Protected payment system ensures safe transactions for both parties.",
    accent: "bg-accent/10 text-accent",
    border: "hover:border-accent/40",
  },
  {
    icon: Clock,
    title: "Quick Matching",
    desc: "Smart algorithms match you with the perfect workers or jobs instantly.",
    accent: "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
    border: "hover:border-rose-400/40",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create your profile", desc: "Sign up and tell us your skills or what kind of worker you need.", icon: Users },
  { step: "02", title: "Get matched", desc: "Our system instantly connects workers with relevant job openings nearby.", icon: TrendingUp },
  { step: "03", title: "Start working", desc: "Apply, get hired, and get paid — all through one platform.", icon: Wrench },
];

const TESTIMONIALS = [
  { name: "Ramesh Kumar", role: "Mason • Chennai", quote: "Found 3 jobs in my first week. The platform is easy to use even on my phone.", rating: 5 },
  { name: "Priya Constructions", role: "Employer • Bangalore", quote: "Hired 8 workers in two days. Much faster than any other method we've tried.", rating: 5 },
  { name: "Suresh Electricals", role: "Electrician • Hyderabad", quote: "The profile feature lets me showcase my certifications. Employers trust me more now.", rating: 5 },
];

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Features */}
      <section className="py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why GigWorker</p>
            <h2 className="text-4xl font-black text-foreground mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              {t('why_choose_gig_worker')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('most_trusted_platform')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, accent, border }) => (
              <div key={title} className={`bg-card border border-border rounded-2xl p-8 card-hover ${border} transition-all`}>
                <div className={`w-12 h-12 rounded-xl ${accent} flex items-center justify-center mb-6`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-black text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-border" />

            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="text-center relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-6 relative">
                  <Icon className="w-10 h-10 text-primary" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full text-xs font-black flex items-center justify-center" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-foreground dark:bg-card text-background dark:text-card-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-4xl font-black" style={{ fontFamily: 'Syne, sans-serif' }}>
              Trusted by workers & employers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, quote, rating }) => (
              <div key={name} className="bg-background/5 dark:bg-background/5 border border-background/10 dark:border-border rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-background/80 dark:text-muted-foreground text-sm leading-relaxed mb-5">"{quote}"</p>
                <div>
                  <p className="font-bold text-background dark:text-foreground text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>{name}</p>
                  <p className="text-background/50 dark:text-muted-foreground text-xs">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-accent/5 border-y border-border">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-black text-foreground mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            {t('ready_to_get_started')}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t('join_thousands_of_professionals')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg px-8 gap-2" asChild>
              <a href="/jobs">
                {t('find_jobs')} <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-2 px-8" onClick={() => navigate('/jobs?action=post-job')}>
              {t('post_job')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
