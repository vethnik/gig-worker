import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Bookmark, BookmarkCheck, Eye, Building2, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import JobApplicationModal from "./JobApplicationModal";
import JobDetailsModal from "./JobDetailsModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

interface JobCardProps {
  jobId: string;
  title: string;
  company: string;
  location: string;
  wage: string;
  type: string;
  description: string;
  skills: string[];
  postedTime: string;
  positionsAvailable: number;
  positionsFilled: number;
}

const TYPE_COLORS: Record<string, string> = {
  "Daily Wage": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  "Contract": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  "Full-time": "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  "Part-time": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  "Seasonal": "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
};

const JobCard = ({ jobId, title, company, location, wage, type, description, skills, postedTime, positionsAvailable, positionsFilled }: JobCardProps) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const isFull = positionsFilled >= positionsAvailable;
  const positionsRemaining = positionsAvailable - positionsFilled;
  const fillPercent = Math.round((positionsFilled / positionsAvailable) * 100);
  const typeClass = TYPE_COLORS[type] || "bg-muted text-muted-foreground border-border";

  useEffect(() => { checkIfSaved(); }, [jobId, user]);

  const checkIfSaved = async () => {
    if (!user) return;
    const { data } = await supabase.from("saved_jobs").select("id").eq("job_id", jobId).eq("user_id", user.id).maybeSingle();
    setIsSaved(!!data);
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast({ title: t("login_required"), description: t("please_log_in_to_save_jobs"), variant: "destructive" });
      return;
    }
    setSaveLoading(true);
    try {
      if (isSaved) {
        await supabase.from("saved_jobs").delete().eq("job_id", jobId).eq("user_id", user.id);
        setIsSaved(false);
        toast({ title: "Removed from saved" });
      } else {
        await supabase.from("saved_jobs").insert({ job_id: jobId, user_id: user.id });
        setIsSaved(true);
        toast({ title: "Job saved!" });
      }
    } catch (e: any) {
      toast({ title: t("error"), description: e.message, variant: "destructive" });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className={`group relative bg-card border border-border rounded-2xl overflow-hidden card-hover ${isFull ? "opacity-60" : ""}`}>

      {/* Top accent strip */}
      <div className={`h-1 w-full ${isFull ? "bg-muted" : "bg-gradient-to-r from-primary to-orange-400"}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-bold text-card-foreground truncate" style={{ fontFamily: 'Syne, sans-serif' }}>
                {title}
              </h3>
              {!isFull && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{company}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex items-center gap-0.5 text-xl font-black text-primary" style={{ fontFamily: 'Syne, sans-serif' }}>
              <IndianRupee className="w-4 h-4" />
              {wage.replace('₹', '').replace('$', '')}
            </div>
            <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full border ${typeClass}`}>
              {type}
            </span>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{location}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{postedTime}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{description}</p>

        {/* Positions bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {isFull ? "All positions filled" : `${positionsRemaining} of ${positionsAvailable} open`}
            </span>
            <span className={`font-semibold ${isFull ? "text-destructive" : "text-primary"}`}>
              {fillPercent}% filled
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isFull ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-lg font-medium">
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-lg">
              +{skills.length - 4} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm"
            onClick={() => setIsApplicationModalOpen(true)}
            disabled={isFull}
          >
            {isFull ? "Positions Filled" : t("apply_now")}
          </Button>
          <Button size="icon" variant="outline" onClick={() => setIsDetailsModalOpen(true)} className="shrink-0">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleSaveJob}
            disabled={saveLoading}
            className={`shrink-0 ${isSaved ? "border-primary/40 bg-primary/10 text-primary" : ""}`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <JobApplicationModal isOpen={isApplicationModalOpen} onClose={() => setIsApplicationModalOpen(false)} jobId={jobId} jobTitle={title} company={company} />
      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        job={{ jobId, title, company, location, wage, type, description, skills, postedTime, positionsAvailable, positionsFilled, category: type, requirements: ["Relevant experience required", "Reliable and punctual", "Team player"], benefits: ["Competitive pay", "Flexible hours", "Safe environment"] }}
        onApply={() => { setIsDetailsModalOpen(false); setIsApplicationModalOpen(true); }}
      />
    </div>
  );
};

export default JobCard;
