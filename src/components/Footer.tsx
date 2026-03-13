import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background dark:bg-card dark:text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CTA band */}
        <div className="py-14 border-b border-background/10 dark:border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
              Ready to find your next gig?
            </h3>
            <p className="text-background/60 dark:text-muted-foreground text-sm">
              Join thousands of workers already on the platform.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shrink-0"
          >
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Main footer grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size="sm" />
            </div>
            <p className="text-background/55 dark:text-muted-foreground text-sm leading-relaxed mb-5">
              Empowering India's blue-collar workforce through technology.
            </p>
            <div className="space-y-2 text-sm text-background/55 dark:text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> hello@gigworker.in</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Chennai, India</div>
            </div>
          </div>

          {/* Workers */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider opacity-50">For Workers</h4>
            <ul className="space-y-3 text-sm text-background/60 dark:text-muted-foreground">
              {[
                { to: "/jobs", label: "Find Jobs" },
                { to: "/workers", label: "Create Profile" },
                { to: "/auth", label: "Sign Up Free" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider opacity-50">For Employers</h4>
            <ul className="space-y-3 text-sm text-background/60 dark:text-muted-foreground">
              {[
                { to: "/jobs", label: "Post a Job" },
                { to: "/workers", label: "Browse Workers" },
                { to: "/auth", label: "Get Started" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider opacity-50">Company</h4>
            <ul className="space-y-3 text-sm text-background/60 dark:text-muted-foreground">
              {["About Us", "Privacy Policy", "Terms of Service", "Contact"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-primary transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-background/10 dark:border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-background/40 dark:text-muted-foreground">
          <p>© 2025 GigWorker. All rights reserved.</p>
          <p>Made with ❤️ for India's workforce</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
