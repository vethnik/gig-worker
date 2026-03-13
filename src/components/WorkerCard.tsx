import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Star, Clock } from "lucide-react";
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
  bio?: string;
  hourlyRate?: string;
  availability?: string;
  certifications?: string[];
  previousWork?: string[];
  languages?: string[];
  createdAt?: string;
}

const TRADE_COLORS: Record<string, string> = {
  "Carpenter": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  "Electrician": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Mason": "bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-300",
  "Plumber": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "HVAC Specialist": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Tile Installer": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "General Laborer": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
};

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const getAvatarGradient = (name: string) => {
  const gradients = [
    "from-orange-400 to-rose-500",
    "from-amber-400 to-orange-500",
    "from-teal-400 to-cyan-500",
    "from-violet-400 to-purple-500",
    "from-emerald-400 to-teal-500",
  ];
  return gradients[name.charCodeAt(0) % gradients.length];
};

const WorkerCard = ({
  name, trade, location, rating, reviewCount, skills, yearsExperience,
  avatar, phone, email, bio, hourlyRate, availability, certifications, previousWork, languages,
}: WorkerCardProps) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleContact = (method: "phone" | "email") => {
    if (method === "phone" && phone) {
      window.location.href = `tel:${phone}`;
      toast({ title: "Opening Phone App", description: `Calling ${name}` });
    } else if (method === "email" && email) {
      window.location.href = `mailto:${email}?subject=Job Opportunity - GigWorker`;
      toast({ title: "Opening Email", description: `Emailing ${name}` });
    }
  };

  const tradeClass = TRADE_COLORS[trade] || "bg-muted text-muted-foreground";
  const availColor = availability === "Available"
    ? "text-green-600 dark:text-green-400"
    : availability === "Busy"
    ? "text-red-500"
    : "text-amber-500";

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden card-hover">

      {/* Top colored strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${getAvatarGradient(name)}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getAvatarGradient(name)} flex items-center justify-center text-white text-lg font-black shrink-0 shadow-md`}
            style={{ fontFamily: 'Syne, sans-serif' }}>
            {avatar ? (
              <img src={avatar} alt={name} className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              getInitials(name)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-card-foreground truncate" style={{ fontFamily: 'Syne, sans-serif' }}>
              {name}
            </h3>
            <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${tradeClass}`}>
              {trade}
            </span>
            <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-0.5 justify-end">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-card-foreground">{rating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">({reviewCount})</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {yearsExperience} yrs exp
          </span>
          {availability && (
            <span className={`flex items-center gap-1 font-medium ${availColor}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {availability}
            </span>
          )}
          {hourlyRate && (
            <span className="ml-auto font-semibold text-primary">{hourlyRate}</span>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-lg">
              +{skills.length - 3} {t("more")}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm"
            onClick={() => setIsProfileModalOpen(true)}
          >
            {t("view_profile")}
          </Button>
          {phone && (
            <Button size="icon" variant="outline" onClick={() => handleContact("phone")} title={`Call ${name}`}>
              <Phone className="w-4 h-4" />
            </Button>
          )}
          {email && (
            <Button size="icon" variant="outline" onClick={() => handleContact("email")} title={`Email ${name}`}>
              <Mail className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <WorkerDetailsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        worker={{
          name, trade, location, rating, reviewCount, skills, yearsExperience,
          phone: phone ?? "", email: email ?? "",
          bio: bio ?? `Experienced ${trade.toLowerCase()} with ${yearsExperience} years in the field.`,
          certifications: certifications ?? [],
          previousWork: previousWork ?? [],
          availability: availability ?? "Available",
          hourlyRate: hourlyRate ?? "Contact for rate",
          languages: languages ?? ["English"],
        }}
        onContact={() => { if (phone) handleContact("phone"); else if (email) handleContact("email"); }}
      />
    </div>
  );
};

export default WorkerCard;
