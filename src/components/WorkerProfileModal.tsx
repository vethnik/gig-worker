import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Award, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: {
    name: string;
    trade: string;
    location: string;
    rating: number;
    reviewCount: number;
    skills: string[];
    yearsExperience: number;
    phone?: string;
    email?: string;
    bio?: string;
    certifications?: string[];
    recentProjects?: Array<{
      title: string;
      description: string;
      completedDate: string;
    }>;
  };
}

const WorkerProfileModal = ({ isOpen, onClose, worker }: WorkerProfileModalProps) => {
  const { toast } = useToast();

  const handleContact = (method: 'phone' | 'email') => {
    if (method === 'phone' && worker.phone) {
      window.location.href = `tel:${worker.phone}`;
      toast({
        title: "Opening Phone App",
        description: `Calling ${worker.name} at ${worker.phone}`,
      });
    } else if (method === 'email' && worker.email) {
      window.location.href = `mailto:${worker.email}?subject=Job Opportunity - Gig Worker`;
      toast({
        title: "Opening Email App",
        description: `Sending email to ${worker.name}`,
      });
    }
  };

  const defaultBio = `Professional ${worker.trade.toLowerCase()} with ${worker.yearsExperience} years of experience. Dedicated to delivering high-quality work and exceeding client expectations. Available for both residential and commercial projects.`;
  
  const defaultProjects = [
    {
      title: "Kitchen Renovation",
      description: "Complete kitchen remodel including custom cabinets and flooring",
      completedDate: "2024-01-15"
    },
    {
      title: "Office Building Electrical",
      description: "Electrical installation for new 3-story office complex",
      completedDate: "2023-11-20"
    }
  ];

  const defaultCertifications = ["Licensed Professional", "Safety Certified", "Trade Association Member"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {worker.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{worker.name}</DialogTitle>
              <DialogDescription className="text-lg text-primary font-medium">
                {worker.trade}
              </DialogDescription>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{worker.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{worker.yearsExperience} years experience</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(worker.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-lg font-semibold">{worker.rating}</span>
              <span className="ml-1 text-muted-foreground">({worker.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed">
              {worker.bio || defaultBio}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Skills & Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Certifications
            </h3>
            <div className="space-y-2">
              {(worker.certifications || defaultCertifications).map((cert, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Projects</h3>
            <div className="space-y-3">
              {(worker.recentProjects || defaultProjects).map((project, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Completed: {new Date(project.completedDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex gap-4 pt-4 border-t border-border">
            {worker.phone && (
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => handleContact('phone')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call {worker.name}
              </Button>
            )}
            {worker.email && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleContact('email')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerProfileModal;