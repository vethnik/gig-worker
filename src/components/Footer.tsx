import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Gig Worker</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Connecting skilled workers with local employers. Find your next 
              construction, electrical, or masonry job with ease.
            </p>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>hello@gigworker.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Workers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/jobs" className="hover:text-primary transition-colors">Find Jobs</a></li>
              <li><a href="/profile" className="hover:text-primary transition-colors">Create Profile</a></li>
              <li><a href="/resources" className="hover:text-primary transition-colors">Resources</a></li>
              <li><a href="/support" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          {/* Employer Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">For Employers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/post-job" className="hover:text-primary transition-colors">Post a Job</a></li>
              <li><a href="/find-workers" className="hover:text-primary transition-colors">Find Workers</a></li>
              <li><a href="/pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="/enterprise" className="hover:text-primary transition-colors">Enterprise</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Gig Worker. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-muted-foreground hover:text-primary text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;