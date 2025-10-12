import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Briefcase, Shield, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* Features Section */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Why Choose Gig Worker?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The most trusted platform for connecting skilled workers with quality employers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Verified Professionals Card */}
            <div 
              className="group relative p-8 rounded-3xl backdrop-blur-glass border border-white/10 hover:border-primary/50 shadow-card hover:shadow-neon-blue transition-all duration-300 overflow-hidden"
              style={{ background: 'var(--glass-bg)' }}
            >
              {/* Mini UI Mockup */}
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary"></div>
                  <div className="flex-1">
                    <div className="h-2 bg-white/20 rounded w-20 mb-1"></div>
                    <div className="h-2 bg-white/10 rounded w-16"></div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="h-1.5 bg-white/10 rounded w-full"></div>
                  <div className="h-1.5 bg-white/10 rounded w-3/4"></div>
                </div>
              </div>
              
              <div className="w-14 h-14 bg-primary/20 backdrop-blur-glass rounded-2xl flex items-center justify-center mb-6 border border-primary/30 shadow-neon-blue">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Verified Professionals</h3>
              <p className="text-white/70 leading-relaxed">
                All workers are background-checked and skill-verified for your peace of mind
              </p>
            </div>
            
            {/* Secure Payments Card */}
            <div 
              className="group relative p-8 rounded-3xl backdrop-blur-glass border border-white/10 hover:border-accent/50 shadow-card hover:shadow-neon-purple transition-all duration-300 overflow-hidden"
              style={{ background: 'var(--glass-bg)' }}
            >
              {/* Mini Payment UI Mockup */}
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-white/60 text-xs">Payment Amount</div>
                  <Shield className="w-4 h-4 text-accent" />
                </div>
                <div className="text-white text-xl font-bold mb-3">₹5,280</div>
                <div className="h-8 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/30">
                  <span className="text-accent text-xs font-medium">Confirm Payment</span>
                </div>
              </div>
              
              <div className="w-14 h-14 bg-accent/20 backdrop-blur-glass rounded-2xl flex items-center justify-center mb-6 border border-accent/30 shadow-neon-purple">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Secure Payments</h3>
              <p className="text-white/70 leading-relaxed">
                Protected payment system ensures safe transactions for both parties
              </p>
            </div>
            
            {/* Quick Matching Card */}
            <div 
              className="group relative p-8 rounded-3xl backdrop-blur-glass border border-white/10 hover:border-secondary/50 shadow-card hover:shadow-neon-pink transition-all duration-300 overflow-hidden"
              style={{ background: 'var(--glass-bg)' }}
            >
              {/* Mini Analytics Mockup */}
              <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-end gap-1 h-16 mb-2">
                  <div className="w-full bg-secondary/30 rounded-t" style={{height: '40%'}}></div>
                  <div className="w-full bg-secondary/40 rounded-t" style={{height: '60%'}}></div>
                  <div className="w-full bg-secondary/60 rounded-t" style={{height: '80%'}}></div>
                  <div className="w-full bg-secondary rounded-t" style={{height: '100%'}}></div>
                </div>
                <div className="text-white/60 text-xs">Match Rate: 98%</div>
              </div>
              
              <div className="w-14 h-14 bg-secondary/20 backdrop-blur-glass rounded-2xl flex items-center justify-center mb-6 border border-secondary/30 shadow-neon-pink">
                <Clock className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Quick Matching</h3>
              <p className="text-white/70 leading-relaxed">
                Advanced algorithms match you with the perfect workers or jobs instantly
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-subtle">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals who trust Gig Worker for their career and hiring needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4" asChild>
              <a href="/jobs">
                Find Jobs
                <ArrowRight className="ml-2" />
              </a>
            </Button>
            <Button variant="professional" size="lg" className="text-lg px-8 py-4" asChild>
              <a href="/workers">
                Hire Workers
              </a>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
