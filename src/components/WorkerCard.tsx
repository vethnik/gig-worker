import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Eye } from "lucide-react";
import { useState } from "react";
import WorkerDetailsModal from "./WorkerDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">
          {t('years_of_experience', { count: yearsExperience })}
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
              +{skills.length - 3} {t('more')}
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
          {t('view_profile')}
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

      <WorkerDetailsModal
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
          phone: phone || "",
          email: email || "",
          bio: `Experienced ${trade.toLowerCase()} with ${yearsExperience} years in the field. Skilled in various aspects of the trade and committed to delivering quality work.`,
          certifications: [
            "Trade License Certified",
            "Safety Training Completed",
            "Quality Assurance Certified"
          ],
          previousWork: [
            "Residential construction projects",
            "Commercial building maintenance",
            "Custom installation work"
          ],
          availability: "Available",
          hourlyRate: "$25-35/hr",
          languages: ["English", "Spanish"]
        }}
        onContact={() => {
          if (phone) {
            handleContact('phone');
          } else if (email) {
            handleContact('email');
          }
        }}
      />
    </div>
  );
};

export default WorkerCard;