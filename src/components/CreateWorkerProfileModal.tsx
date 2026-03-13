import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { User, Briefcase, MapPin, Award, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

const workerProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  trade: z.string().trim().min(2, "Trade/profession is required").max(100),
  location: z.string().trim().min(2, "Location is required").max(100),
  yearsExperience: z.number().min(0).max(50),
  bio: z.string().trim().min(20, "Bio must be at least 20 characters").max(1000),
  skills: z.string().trim().max(500),
  phone: z.string().trim().min(10, "Valid phone number is required").max(20),
  email: z.string().email("Valid email is required"),
  hourlyRate: z.string().trim().min(1, "Hourly rate is required").max(50),
  availability: z.string().min(1, "Availability is required"),
});

type FormData = z.infer<typeof workerProfileSchema>;

interface CreateWorkerProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileCreated: () => void;
}

const TRADES = [
  "General Laborer", "Carpenter", "Electrician", "Mason", "HVAC Specialist",
  "Plumber", "Tile Installer", "Painter", "Roofer", "Landscaper",
  "Construction Helper", "Warehouse Worker", "Factory Worker", "Farm Laborer",
  "Event Setup Crew", "Janitorial Worker", "Other",
];

const AVAILABILITY_OPTIONS = [
  "Available", "Busy", "Available Weekends", "Available Evenings", "Part-time Only",
];

const INITIAL_FORM: FormData = {
  name: "", trade: "", location: "", yearsExperience: 0,
  bio: "", skills: "", phone: "", email: "", hourlyRate: "", availability: "Available",
};

const CreateWorkerProfileModal = ({ open, onOpenChange, onProfileCreated }: CreateWorkerProfileModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (field: keyof FormData, value: string | number) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a worker profile",
        variant: "destructive",
      });
      return;
    }

    const result = workerProfileSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as keyof FormData] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const validated = result.data;
      const skillsArray = validated.skills
        ? validated.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const insert: TablesInsert<"worker_profiles"> = {
        user_id: user.id,
        name: validated.name,
        trade: validated.trade,
        location: validated.location,
        years_experience: validated.yearsExperience,
        bio: validated.bio,
        skills: skillsArray,
        phone: validated.phone,
        email: validated.email,
        hourly_rate: validated.hourlyRate,
        availability: validated.availability,
        certifications: [],
        previous_work: [],
        languages: ["English"],
      };

      const { error } = await supabase.from("worker_profiles").insert(insert);

      if (error) throw error;

      toast({ title: "Success!", description: "Worker profile created successfully" });
      setFormData(INITIAL_FORM);
      onProfileCreated();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create worker profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Create Worker Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g., John Smith"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="trade" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Trade/Profession *
                </Label>
                <Select value={formData.trade} onValueChange={(v) => set("trade", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRADES.map((trade) => (
                      <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.trade && <p className="text-sm text-destructive">{errors.trade}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g., Chennai, Tamil Nadu"
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center gap-2">
                  <Award className="w-4 h-4" /> {t("years_experience_label")} *
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience}
                  onChange={(e) => set("yearsExperience", parseInt(e.target.value) || 0)}
                />
                {errors.yearsExperience && <p className="text-sm text-destructive">{errors.yearsExperience}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate *</Label>
                <Input
                  id="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={(e) => set("hourlyRate", e.target.value)}
                  placeholder="e.g., ₹500-700/day"
                />
                {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability *</Label>
                <Select value={formData.availability} onValueChange={(v) => set("availability", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Describe your experience, specialties, and what makes you stand out..."
                  className="min-h-[120px]"
                />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Specialties</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => set("skills", e.target.value)}
                  placeholder="e.g., Framing, Custom Cabinets, Blueprint Reading (separate with commas)"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkerProfileModal;
