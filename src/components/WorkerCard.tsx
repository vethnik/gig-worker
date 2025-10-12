import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import WorkerProfileModal from "./WorkerProfileModal";
import { useToast } from "@/hooks/use-toast";

interface WorkerCardProps {
  name: string;
  trade: string;
  location: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  yearsExperience: number;
  avatar?: string;
  phone?: string;
  email?: string;
}

const WorkerCard = ({ 
  name, 
  trade, 
  location, 
  rating, 
  reviewCount, 
  skills, 
  yearsExperience,
  avatar,
  phone,
  email
}: WorkerCardProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { toast } = useToast();

  const handleContact = (method: 'phone' | 'email') => {
    if (method === 'phone' && phone) {
      window.location.href = `tel:${phone}`;
      toast({
        title: "Opening Phone App",
        description: `Calling ${name} at ${phone}`,
      });
    } else if (method === 'email' && email) {
      window.location.href = `mailto:${email}?subject=Job Opportunity - Gig Worker`;
      toast({
        title: "Opening Email App",
        description: `Sending email to ${name}`,
      });
    }
  };
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
          {avatar ? (
            <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            name.split(' ').map(n => n[0]).join('')
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-card-foreground">{name}</h3>
          <p className="text-primary font-medium">{trade}</p>
          <div className="flex items-center text-muted-foreground mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating} ({reviewCount} reviews)
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          {yearsExperience} years of experience
        </p>
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
              +{skills.length - 3} more
            </span>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="default" 
          className="flex-1"
          onClick={() => setIsProfileModalOpen(true)}
        >
          View Profile
        </Button>
        {phone && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleContact('phone')}
            title={`Call ${name}`}
          >
            <Phone className="w-4 h-4" />
          </Button>
        )}
        {email && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleContact('email')}
            title={`Email ${name}`}
          >
            <Mail className="w-4 h-4" />
          </Button>
        )}
      </div>

      <WorkerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        worker={{
          name,
          trade,
          location,
          rating,
          reviewCount,
          skills,
          yearsExperience,
          phone,
          email
        }}
      />
    </div>
  );
};

export default WorkerCard;