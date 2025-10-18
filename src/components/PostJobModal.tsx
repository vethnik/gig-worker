import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import LocationPickerSimple from "./LocationPickerSimple";

const jobSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
  company: z.string().trim().min(2, "Company name is required").max(100),
  location: z.string().trim().min(2, "Location is required").max(100),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
  wage: z.string().trim().min(1, "Wage is required").max(50),
  type: z.string().min(1, "Job type is required"),
  description: z.string().trim().min(20, "Description must be at least 20 characters").max(2000),
  category: z.string().min(1, "Category is required"),
  skills: z.string().trim().max(500),
  positions_available: z.number().min(1, "At least 1 position is required").max(100),
});

interface PostJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobPosted: () => void;
}

const PostJobModal = ({ open, onOpenChange, onJobPosted }: PostJobModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    latitude: 0,
    longitude: 0,
    wage: "",
    type: "Full-time",
    description: "",
    category: "",
    skills: "",
    positions_available: 1,
  });
  
  const [locationData, setLocationData] = useState({
    address: "",
    latitude: 0,
    longitude: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "🏗️ Construction-Related Work",
    "🚛 Loading & Unloading",
    "🏠 Household Work",
    "🌱 Outdoor & Agricultural Work",
    "🏢 Small Contract Work",
  ];

  const jobTypes = ["Full-time", "Part-time", "Contract", "Daily Wage"];

  const handleLocationChange = (location: { address: string; latitude: number; longitude: number }) => {
    try {
      setLocationData(location);
      // Clear location error when location is selected
      if (errors.location && location.address) {
        setErrors(prev => ({ ...prev, location: "" }));
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job",
        variant: "destructive",
      });
      return;
    }

    try {
      // Combine form data with location data for validation
      const dataToValidate = {
        ...formData,
        location: locationData.address,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      };
      
      const validated = jobSchema.parse(dataToValidate);
      setErrors({});
      setLoading(true);

      const skillsArray = validated.skills
        ? validated.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const { error } = await supabase.from("jobs").insert({
        user_id: user.id,
        title: validated.title,
        company: validated.company,
        location: validated.location,
        latitude: validated.latitude,
        longitude: validated.longitude,
        wage: validated.wage,
        type: validated.type,
        description: validated.description,
        category: validated.category,
        skills: skillsArray,
        positions_available: validated.positions_available,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Job posted successfully",
      });

      setFormData({
        title: "",
        company: "",
        location: "",
        latitude: 0,
        longitude: 0,
        wage: "",
        type: "Full-time",
        description: "",
        category: "",
        skills: "",
        positions_available: 1,
      });
      setLocationData({
        address: "",
        latitude: 0,
        longitude: 0,
      });
      onJobPosted();
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
          description: "Failed to post job. Please try again.",
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
          <DialogTitle className="text-2xl font-bold">Post a Job</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Masonry Work (Mistri)"
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Your company name"
              />
              {errors.company && <p className="text-sm text-destructive">{errors.company}</p>}
            </div>

            {/* Location Picker with Map */}
            <div className="space-y-2">
              <LocationPickerSimple
                value={locationData}
                onChange={handleLocationChange}
                error={errors.location || errors.latitude || errors.longitude}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wage" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Wage *
              </Label>
              <Input
                id="wage"
                value={formData.wage}
                onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                placeholder="e.g., ₹500-700/day"
              />
              {errors.wage && <p className="text-sm text-destructive">{errors.wage}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Job Type *
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the job requirements, responsibilities, and qualifications..."
                rows={5}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., Brick Laying, Plastering, Concrete Mixing"
              />
              {errors.skills && <p className="text-sm text-destructive">{errors.skills}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="positions_available">Number of Positions Needed *</Label>
              <Input
                id="positions_available"
                type="number"
                min="1"
                max="100"
                value={formData.positions_available}
                onChange={(e) => setFormData({ ...formData, positions_available: parseInt(e.target.value) || 1 })}
                placeholder="e.g., 3"
              />
              {errors.positions_available && <p className="text-sm text-destructive">{errors.positions_available}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostJobModal;
