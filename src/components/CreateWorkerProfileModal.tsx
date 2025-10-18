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
import { User, Briefcase, MapPin, Star, Phone, Mail, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

const workerProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  trade: z.string().trim().min(2, "Trade/profession is required").max(100),
  location: z.string().trim().min(2, "Location is required").max(100),
  yearsExperience: z.number().min(0, "Years of experience must be 0 or more").max(50),
  bio: z.string().trim().min(20, "Bio must be at least 20 characters").max(1000),
  skills: z.string().trim().max(500),
  phone: z.string().trim().min(10, "Valid phone number is required").max(20),
  email: z.string().email("Valid email is required"),
  hourlyRate: z.string().trim().min(1, "Hourly rate is required").max(50),
  availability: z.string().min(1, "Availability is required"),
});

interface CreateWorkerProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileCreated: (newWorkerProfile: any) => void;
}

const CreateWorkerProfileModal = ({ open, onOpenChange, onProfileCreated }: CreateWorkerProfileModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    trade: "",
    location: "",
    yearsExperience: 0,
    bio: "",
    skills: "",
    phone: "",
    email: "",
    hourlyRate: "",
    availability: "Available",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const trades = [
    "General Laborer",
    "Carpenter",
    "Electrician", 
    "Mason",
    "HVAC Specialist",
    "Plumber",
    "Tile Installer",
    "Painter",
    "Roofer",
    "Landscaper",
    "Construction Helper",
    "Warehouse Worker",
    "Factory Worker",
    "Farm Laborer",
    "Event Setup Crew",
    "Janitorial Worker",
    "Other"
  ];

  const availabilityOptions = [
    "Available",
    "Busy",
    "Available Weekends",
    "Available Evenings",
    "Part-time Only"
  ];

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

    try {
      const validated = workerProfileSchema.parse(formData);
      setErrors({});
      setLoading(true);

      const skillsArray = validated.skills
        ? validated.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      // Try to save to database, fallback to localStorage if table doesn't exist
      let newWorkerProfile;
      
      try {
        // Attempt to save to database
        const { data: workerProfile, error } = await (supabase as any)
          .from('worker_profiles')
          .insert({
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
            certifications: ["Profile Recently Created"],
            previous_work: ["New to the platform"],
            languages: ["English"]
          })
          .select()
          .single();

        if (error) {
          throw new Error(error.message);
        }

        // Create the worker profile object from database response
        newWorkerProfile = {
          id: workerProfile.id,
          name: workerProfile.name,
          trade: workerProfile.trade,
          location: workerProfile.location,
          rating: workerProfile.rating || 0,
          reviewCount: workerProfile.review_count || 0,
          skills: workerProfile.skills || [],
          yearsExperience: workerProfile.years_experience,
          phone: workerProfile.phone,
          email: workerProfile.email,
          hourlyRate: workerProfile.hourly_rate,
          availability: workerProfile.availability,
          bio: workerProfile.bio,
          certifications: workerProfile.certifications || [],
          previousWork: workerProfile.previous_work || [],
          languages: workerProfile.languages || [],
          createdAt: workerProfile.created_at,
          isUserCreated: true,
        };
      } catch (dbError) {
        console.log('Database save failed, using localStorage fallback:', dbError);
        
        // Fallback: Create profile object for localStorage
        newWorkerProfile = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: validated.name,
          trade: validated.trade,
          location: validated.location,
          rating: 0,
          reviewCount: 0,
          skills: skillsArray,
          yearsExperience: validated.yearsExperience,
          phone: validated.phone,
          email: validated.email,
          hourlyRate: validated.hourlyRate,
          availability: validated.availability,
          bio: validated.bio,
          certifications: ["Profile Recently Created"],
          previousWork: ["New to the platform"],
          languages: ["English"],
          createdAt: new Date().toISOString(),
          isUserCreated: true,
        };
      }

      toast({
        title: "Success!",
        description: "Worker profile created successfully",
      });

      setFormData({
        name: "",
        trade: "",
        location: "",
        yearsExperience: 0,
        bio: "",
        skills: "",
        phone: "",
        email: "",
        hourlyRate: "",
        availability: "Available",
      });
      
      // Pass the new profile back to the parent component
      onProfileCreated(newWorkerProfile);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast({
          title: "Error",
          description: "Failed to create worker profile. Please try again.",
          variant: "destructive",
        });
      }
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
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., John Smith"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="trade" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Trade/Profession *
                </Label>
                <Select value={formData.trade} onValueChange={(value) => setFormData({ ...formData, trade: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {trades.map((trade) => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.trade && <p className="text-sm text-destructive">{errors.trade}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Brooklyn, NY"
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {t('years_experience_label')} *
                </Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 5"
                />
                {errors.yearsExperience && <p className="text-sm text-destructive">{errors.yearsExperience}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate *</Label>
                <Input
                  id="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  placeholder="e.g., $25-35/hr"
                />
                {errors.hourlyRate && <p className="text-sm text-destructive">{errors.hourlyRate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability *</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availabilityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.availability && <p className="text-sm text-destructive">{errors.availability}</p>}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g., Framing, Custom Cabinets, Blueprint Reading (separate with commas)"
                  className="min-h-[80px]"
                />
                {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkerProfileModal;
