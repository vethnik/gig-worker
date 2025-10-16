import { Button } from "@/components/ui/button";
import { MapPin, Clock, User, Users, Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useEffect } from "react";
import JobApplicationModal from "./JobApplicationModal";
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

const JobCard = ({ jobId, title, company, location, wage, type, description, skills, postedTime, positionsAvailable, positionsFilled }: JobCardProps) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const isFull = positionsFilled >= positionsAvailable;
  const positionsRemaining = positionsAvailable - positionsFilled;

  useEffect(() => {
    checkIfSaved();
  }, [jobId, user]);

  const checkIfSaved = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("id")
        .eq("job_id", jobId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setIsSaved(!!data);
    } catch (error) {
      console.error("Error checking if job is saved:", error);
    }
  };

  const handleSaveJob = async () => {
    if (!user) {
      toast({
        title: t('login_required'),
        description: t('please_log_in_to_save_jobs'),
        variant: "destructive"
      });
      return;
    }

    setSaveLoading(true);
    try {
      if (isSaved) {
        // Unsave the job
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("job_id", jobId)
          .eq("user_id", user.id);

        if (error) throw error;

        setIsSaved(false);
        toast({
          title: t('job_removed'),
          description: `${title} ${t('has_been_removed_from_your_saved_jobs')}`,
        });
      } else {
        // Save the job
        const { error } = await supabase
          .from("saved_jobs")
          .insert({
            job_id: jobId,
            user_id: user.id
          });

        if (error) throw error;

        setIsSaved(true);
        toast({
          title: t('job_saved'),
          description: `${title} ${t('has_been_saved_to_your_favorites')}`,
        });
      }
    } catch (error: any) {
      console.error("Error saving job:", error);
      toast({
        title: t('error'),
        description: error.message || t('failed_to_save_job_please_try_again'),
        variant: "destructive"
      });
    } finally {
      setSaveLoading(false);
    }
  };
  return (
    <div 
      className={`group relative p-6 rounded-3xl backdrop-blur-glass border border-white/10 shadow-card hover:shadow-neon-blue transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isFull ? 'opacity-60' : ''}`}
      style={{ background: 'var(--glass-bg)' }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              {!isFull && (
                <span className="px-2 py-1 text-xs font-medium bg-primary/20 text-primary border border-primary/30 rounded-full">
                  {t('active')}
                </span>
              )}
            </div>
            <div className="flex items-center text-white/60 mb-2">
              <User className="w-4 h-4 mr-2" />
              <span className="text-sm">{company}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">{wage}</div>
            <div className="text-xs text-white/60 mt-1 px-2 py-1 bg-white/5 rounded-full">
              {type === 'Daily Wage' ? t('daily_wage') : 
               type === 'Contract' ? t('contract') : 
               type === 'Seasonal' ? t('seasonal') : 
               type === 'Part-time' ? t('part_time') : 
               type === 'Full-time' ? t('full_time') : type}
            </div>
          </div>
        </div>
        
        {/* Location and Time Info */}
        <div className="flex items-center text-white/70 mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm">{postedTime}</span>
          </div>
        </div>

        {/* Positions Available */}
        <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-white/60">{t('positions')}</div>
                <div className={`text-sm font-semibold ${isFull ? 'text-destructive' : 'text-white'}`}>
                  {isFull ? t('filled') : `${positionsRemaining} ${t('available')}`}
                </div>
              </div>
            </div>
            {!isFull && (
              <div className="text-right">
                <div className="text-xs text-white/60">{t('total')}</div>
                <div className="text-sm font-semibold text-white">{positionsAvailable}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-white/70 mb-4 text-sm leading-relaxed line-clamp-2">{description}</p>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-white/5 backdrop-blur-sm text-white/80 text-xs rounded-lg font-medium border border-white/10 hover:border-primary/50 transition-colors"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-3 py-1.5 bg-white/5 text-white/60 text-xs rounded-lg">
              +{skills.length - 4} {t('more')}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-neon-blue hover:shadow-glow transition-all duration-300 font-semibold"
            onClick={() => setIsApplicationModalOpen(true)}
            disabled={isFull}
          >
            {isFull ? 'Positions Filled' : t('apply_now')}
          </Button>
          <Button 
            size="icon"
            className={`bg-white/10 backdrop-blur-glass border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 ${isSaved ? 'shadow-neon-purple border-accent/50' : ''}`}
            onClick={handleSaveJob}
            disabled={saveLoading}
            title={isSaved ? "Unsave Job" : "Save Job"}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-accent" /> : <Bookmark className="w-4 h-4 text-white" />}
          </Button>
        </div>
      </div>

      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        jobId={jobId}
        jobTitle={title}
        company={company}
      />
    </div>
  );
};

export default JobCard;