import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, Users, DollarSign, Briefcase, Calendar, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
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
    category?: string;
    requirements?: string[];
    benefits?: string[];
    contactEmail?: string;
    contactPhone?: string;
  };
  onApply: () => void;
}

const JobDetailsModal = ({ isOpen, onClose, job, onApply }: JobDetailsModalProps) => {
  const { t } = useTranslation();
  const isFull = job.positionsFilled >= job.positionsAvailable;
  const positionsRemaining = job.positionsAvailable - job.positionsFilled;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            {job.title}
            {!isFull && (
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                {t('active')}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('company')}</p>
                  <p className="font-semibold text-foreground">{job.company}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('location')}</p>
                  <p className="font-semibold text-foreground">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p className="font-semibold text-foreground">{job.postedTime}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Wage</p>
                  <p className="text-2xl font-bold text-primary">{job.wage}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <Badge variant="outline" className="font-semibold">
                    {job.type === 'Daily Wage' ? t('daily_wage') : 
                     job.type === 'Contract' ? t('contract') : 
                     job.type === 'Seasonal' ? t('seasonal') : 
                     job.type === 'Part-time' ? t('part_time') : 
                     job.type === 'Full-time' ? t('full_time') : job.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('positions')}</p>
                  <p className="font-semibold text-foreground">
                    {isFull ? t('filled') : `${positionsRemaining} ${t('available')} of ${job.positionsAvailable}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Job Description</h3>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Skills Required */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Requirements (if available) */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits (if available) */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Information (if available) */}
          {(job.contactEmail || job.contactPhone) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
              <div className="p-4 bg-muted/50 rounded-lg border space-y-2">
                {job.contactEmail && (
                  <p className="text-foreground">
                    <span className="font-medium">Email:</span> {job.contactEmail}
                  </p>
                )}
                {job.contactPhone && (
                  <p className="text-foreground">
                    <span className="font-medium">Phone:</span> {job.contactPhone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={onApply}
              disabled={isFull}
              className="flex-1"
              size="lg"
            >
              {isFull ? 'Positions Filled' : t('apply_now')}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              size="lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
