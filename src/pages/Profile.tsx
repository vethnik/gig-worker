import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobApplicationModal from "@/components/JobApplicationModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  User, Edit3, Briefcase, Eye, BookOpen, Settings,
  MapPin, Phone, Mail, Calendar, Star, FileText,
  TrendingUp, Camera, Bookmark, ChevronRight, Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string; company: string } | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "", phone: "", location: "", bio: "", skills: "", avatarUrl: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchApplications();
      fetchPostedJobs();
      fetchSavedJobs();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from("profiles").select("*").eq("id", user?.id).maybeSingle();
      if (data) {
        setEditForm({
          fullName: data.full_name || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills ? data.skills.join(", ") : "",
          avatarUrl: data.avatar_url || "",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    const { data } = await supabase
      .from("job_applications")
      .select(`id, created_at, job_id, jobs (id, title, company, location, wage, type, description, positions_available, positions_filled)`)
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    setApplications(data || []);
  };

  const fetchPostedJobs = async () => {
    const { data } = await supabase.from("jobs").select("*").eq("user_id", user?.id).order("created_at", { ascending: false });
    setPostedJobs(data || []);
  };

  const fetchSavedJobs = async () => {
    const { data } = await supabase
      .from("saved_jobs")
      .select(`id, created_at, jobs (id, title, company, location, wage, type, positions_available, positions_filled)`)
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    setSavedJobs(data || []);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingPhoto(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      setEditForm((f) => ({ ...f, avatarUrl: publicUrl }));
      toast({ title: "Photo updated!" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const skillsArray = editForm.skills.split(",").map((s) => s.trim()).filter(Boolean);
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        full_name: editForm.fullName,
        phone: editForm.phone,
        location: editForm.location,
        bio: editForm.bio,
        skills: skillsArray,
        avatar_url: editForm.avatarUrl,
      });
      if (error) throw error;
      toast({ title: "Profile saved!" });
      setIsEditModalOpen(false);
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    }
  };

  const initials = editForm.fullName
    ? editForm.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? "?";

  const TABS = [
    { id: "applications", label: "Applications", icon: Briefcase, count: applications.length },
    { id: "posted", label: "Posted Jobs", icon: FileText, count: postedJobs.length },
    { id: "saved", label: "Saved", icon: Bookmark, count: savedJobs.length },
    { id: "settings", label: "Settings", icon: Settings, count: null },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
          <Lock className="w-12 h-12 text-muted-foreground" />
          <h2 className="text-2xl font-black text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>Sign in required</h2>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
          <Link to="/auth"><Button className="bg-primary text-white">Sign In</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header banner */}
      <div className="pt-16 bg-foreground dark:bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg"
                style={{ fontFamily: "Syne, sans-serif" }}>
                {editForm.avatarUrl
                  ? <img src={editForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  : initials}
              </div>
              <label htmlFor="photo-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                {uploadingPhoto
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera className="w-5 h-5 text-white" />}
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-black text-white dark:text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>
                {editForm.fullName || "Your Name"}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-white/60 dark:text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{user.email}</span>
                {editForm.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{editForm.location}</span>}
                {editForm.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{editForm.phone}</span>}
              </div>
              {editForm.bio && <p className="text-sm text-white/50 dark:text-muted-foreground mt-2 max-w-lg">{editForm.bio}</p>}
            </div>

            <Button onClick={() => setIsEditModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white gap-2 shrink-0">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-8 pb-0">
            {[
              { label: "Applications", value: applications.length },
              { label: "Posted Jobs", value: postedJobs.length },
              { label: "Saved Jobs", value: savedJobs.length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white dark:text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>{value}</p>
                <p className="text-xs text-white/50 dark:text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === id
                    ? "border-primary text-primary dark:text-primary"
                    : "border-transparent text-white/50 dark:text-muted-foreground hover:text-white dark:hover:text-foreground"
                }`}>
                <Icon className="w-4 h-4" />
                {label}
                {count !== null && count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === id ? "bg-primary text-white" : "bg-white/10 dark:bg-muted text-white/70 dark:text-muted-foreground"
                  }`}>{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Applications */}
        {activeTab === "applications" && (
          <div className="space-y-3">
            <h2 className="text-lg font-black text-foreground mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Your Applications</h2>
            {applications.length === 0 ? (
              <EmptyState icon={Briefcase} title="No applications yet" desc="Browse jobs and apply to get started." action={{ label: "Browse Jobs", href: "/jobs" }} />
            ) : applications.map((app) => (
              <div key={app.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 hover:border-primary/30 transition-all">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-card-foreground truncate" style={{ fontFamily: "Syne, sans-serif" }}>{app.jobs?.title}</h4>
                  <p className="text-sm text-muted-foreground">{app.jobs?.company} • {app.jobs?.location}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Applied {new Date(app.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-primary">{app.jobs?.wage}</span>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-0">Applied</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posted Jobs */}
        {activeTab === "posted" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>Jobs You've Posted</h2>
              <Link to="/jobs?action=post-job">
                <Button size="sm" className="bg-primary text-white gap-1.5">+ Post New Job</Button>
              </Link>
            </div>
            {postedJobs.length === 0 ? (
              <EmptyState icon={FileText} title="No jobs posted" desc="Post a job to start finding workers." action={{ label: "Post a Job", href: "/jobs?action=post-job" }} />
            ) : postedJobs.map((job) => {
              const isFull = job.positions_filled >= job.positions_available;
              return (
                <div key={job.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 hover:border-primary/30 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-card-foreground truncate" style={{ fontFamily: "Syne, sans-serif" }}>{job.title}</h4>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isFull ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"}`}>
                        {isFull ? "Filled" : "Open"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.location} • {job.type}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="text-primary font-semibold">{job.wage}</span>
                      <span>{job.positions_filled}/{job.positions_available} positions filled</span>
                      <span>Posted {new Date(job.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                  {/* Fill progress bar */}
                  <div className="w-24 shrink-0">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isFull ? "bg-destructive" : "bg-primary"}`}
                        style={{ width: `${Math.round((job.positions_filled / job.positions_available) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                      {Math.round((job.positions_filled / job.positions_available) * 100)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Saved Jobs */}
        {activeTab === "saved" && (
          <div className="space-y-3">
            <h2 className="text-lg font-black text-foreground mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Saved Jobs</h2>
            {savedJobs.length === 0 ? (
              <EmptyState icon={Bookmark} title="No saved jobs" desc="Bookmark jobs you're interested in to view them later." action={{ label: "Browse Jobs", href: "/jobs" }} />
            ) : savedJobs.map((savedJob: any) => {
              const job = savedJob.jobs;
              const isFull = job.positions_filled >= job.positions_available;
              return (
                <div key={savedJob.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4 hover:border-primary/30 transition-all">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-card-foreground truncate" style={{ fontFamily: "Syne, sans-serif" }}>{job.title}</h4>
                    <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-primary">{job.wage}</span>
                      <span className="text-xs text-muted-foreground">{job.positions_available - job.positions_filled} positions left</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={isFull}
                    onClick={() => setSelectedJob({ id: job.id, title: job.title, company: job.company })}
                    className={isFull ? "" : "bg-primary text-white hover:bg-primary/90"}
                  >
                    {isFull ? "Filled" : "Apply Now"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="max-w-xl space-y-4">
            <h2 className="text-lg font-black text-foreground mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Account Settings</h2>
            {[
              { label: "Email Notifications", desc: "Job recommendations and application updates", defaultOn: true },
              { label: "Profile Visibility", desc: "Make your profile visible to employers", defaultOn: true },
              { label: "Recruiter Contact", desc: "Allow recruiters to contact you directly", defaultOn: false },
              { label: "Weekly Digest", desc: "Receive a weekly summary of new jobs", defaultOn: false },
            ].map(({ label, desc, defaultOn }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-card-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
                  <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}

            <div className="pt-4 flex gap-3">
              <Button variant="outline" className="gap-2"><Lock className="w-4 h-4" />Change Password</Button>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        )}
      </div>

      <Footer />

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-black" style={{ fontFamily: "Syne, sans-serif" }}>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {[
              { id: "fullName", label: "Full Name", placeholder: "Ramesh Kumar" },
              { id: "phone", label: "Phone", placeholder: "+91 98765 43210" },
              { id: "location", label: "Location", placeholder: "Chennai, Tamil Nadu" },
              { id: "skills", label: "Skills (comma-separated)", placeholder: "Carpentry, Welding, Blueprint Reading" },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
                <Input
                  id={id}
                  placeholder={placeholder}
                  value={editForm[id as keyof typeof editForm]}
                  onChange={(e) => setEditForm((f) => ({ ...f, [id]: e.target.value }))}
                  className="h-10 rounded-xl"
                />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell employers about yourself..."
                value={editForm.bio}
                onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>
            <Button onClick={handleEditSubmit} className="w-full bg-primary text-white hover:bg-primary/90 h-11 rounded-xl">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedJob && (
        <JobApplicationModal
          isOpen={!!selectedJob}
          onClose={() => { setSelectedJob(null); fetchApplications(); }}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          company={selectedJob.company}
        />
      )}
    </div>
  );
};

// Empty state helper
const EmptyState = ({ icon: Icon, title, desc, action }: {
  icon: any; title: string; desc: string;
  action: { label: string; href: string };
}) => (
  <div className="text-center py-16 bg-card border border-border rounded-2xl">
    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Icon className="w-7 h-7 text-muted-foreground" />
    </div>
    <h3 className="font-bold text-foreground mb-1" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h3>
    <p className="text-sm text-muted-foreground mb-5">{desc}</p>
    <Link to={action.href}>
      <Button size="sm" className="bg-primary text-white hover:bg-primary/90">{action.label} →</Button>
    </Link>
  </div>
);

export default Profile;
