import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, User, Phone, Mail, Calendar, Award, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WorkerDetailsModalProps {
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
    phone: string;
    email: string;
    bio?: string;
    certifications?: string[];
    previousWork?: string[];
    availability?: string;
    hourlyRate?: string;
    languages?: string[];
  };
  onContact: () => void;
}

const WorkerDetailsModal = ({ isOpen, onClose, worker, onContact }: WorkerDetailsModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            {worker.name}
            <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
              {worker.trade}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info and Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('location')}</p>
                  <p className="font-semibold text-foreground">{worker.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-semibold text-foreground">{t('years_of_experience', { count: worker.yearsExperience })}</p>
                </div>
              </div>

              {worker.hourlyRate && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="text-xl font-bold text-primary">{worker.hourlyRate}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t('rating')}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{worker.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(worker.rating)
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({worker.reviewCount} {t('reviews')})</span>
                  </div>
                </div>
              </div>

              {worker.availability && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <Badge variant="outline" className="font-semibold text-green-600 border-green-600">
                      {worker.availability}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bio/Description */}
          {worker.bio && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">About</h3>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-foreground leading-relaxed">{worker.bio}</p>
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Certifications */}
          {worker.certifications && worker.certifications.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {worker.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
                    <Award className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-foreground">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Work */}
          {worker.previousWork && worker.previousWork.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Previous Work Experience</h3>
              <ul className="space-y-2">
                {worker.previousWork.map((work, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Briefcase className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{work}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {worker.languages && worker.languages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {worker.languages.map((language, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{worker.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">{worker.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={onContact}
              className="flex-1"
              size="lg"
            >
              Contact Worker
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

export default WorkerDetailsModal;
