import React, { useState, useEffect } from "react";
import { Search, Filter, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobCard from "@/components/JobCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostJobModal from "@/components/PostJobModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Jobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all_jobs");
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Define filter categories with keys and translations
  const categoryKeys = [
    "all_jobs",
    "construction_related_work",
    "loading_unloading", 
    "household_work",
    "outdoor_agricultural_work",
    "small_contract_work"
  ];
  
  const categories = categoryKeys.map(key => ({
    key,
    label: t(key)
  }));

  useEffect(() => {
    fetchJobs();
    // Check if we should open the post job modal from URL params
    try {
      if (searchParams.get('action') === 'post-job') {
        setIsPostJobModalOpen(true);
        // Clean up the URL parameter
        setSearchParams({});
      }
    } catch (error) {
      console.error('Error handling URL parameters:', error);
    }
  }, [searchParams, setSearchParams]);

  

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJobPosted = () => {
    fetchJobs();
  };

  // Create a mapping function to check if job matches category
  const jobMatchesCategory = (job: any, categoryKey: string) => {
    // If "All Jobs" is selected, show all
    if (categoryKey === "all_jobs") {
      return true;
    }
    
    // Map category keys to their corresponding job categories/keywords
    const jobTitle = job.title.toLowerCase();
    const jobDescription = job.description?.toLowerCase() || "";
    const jobCategory = job.category?.toLowerCase() || "";
    
    if (categoryKey === "construction_related_work") {
      return jobTitle.includes("construction") || 
             jobTitle.includes("building") || 
             jobTitle.includes("carpenter") ||
             jobTitle.includes("mason") ||
             jobDescription.includes("construction") ||
             jobCategory.includes("construction");
    }
    if (categoryKey === "loading_unloading") {
      return jobTitle.includes("loading") || 
             jobTitle.includes("unloading") ||
             jobTitle.includes("warehouse") ||
             jobTitle.includes("logistics") ||
             jobDescription.includes("loading") ||
             jobDescription.includes("unloading");
    }
    if (categoryKey === "household_work") {
      return jobTitle.includes("household") || 
             jobTitle.includes("cleaning") ||
             jobTitle.includes("domestic") ||
             jobTitle.includes("home") ||
             jobDescription.includes("household") ||
             jobDescription.includes("cleaning");
    }
    if (categoryKey === "outdoor_agricultural_work") {
      return jobTitle.includes("agricultural") || 
             jobTitle.includes("farming") ||
             jobTitle.includes("outdoor") ||
             jobTitle.includes("landscaping") ||
             jobDescription.includes("agricultural") ||
             jobDescription.includes("farming");
    }
    if (categoryKey === "small_contract_work") {
      return jobTitle.includes("contract") || 
             jobTitle.includes("freelance") ||
             jobTitle.includes("project") ||
             jobDescription.includes("contract") ||
             jobDescription.includes("project");
    }
    
    return false;
  };

  // Filter jobs based on selected category and search term
  const filteredJobs = jobs.filter((job) => {
    const matchesCategory = jobMatchesCategory(job, selectedCategory);

    const matchesSearch =
      searchTerm === "" ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skills &&
        job.skills.some((skill: string) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesLocation =
      locationFilter === "" ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesCategory && matchesSearch && matchesLocation;
  });

  

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {t('find_your_next_job')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('discover_opportunities')}
              </p>
            </div>
            {user && (
              <Button
                size="lg"
                onClick={() => setIsPostJobModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t('post_job')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t('search_jobs_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative md:w-64">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t('location')}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="default" className="md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              {t('filters')}
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className="transition-all duration-200"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results info removed per request */}

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">Loading jobs...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                jobId={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                wage={job.wage}
                type={job.type}
                description={job.description}
                skills={job.skills || []}
                postedTime={getTimeAgo(job.created_at)}
                positionsAvailable={job.positions_available || 1}
                positionsFilled={job.positions_filled || 0}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {t('no_jobs_found')}
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory("all_jobs");
                  setSearchTerm("");
                  setLocationFilter("");
                }}
              >
                {t('clear_filters')}
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            {t('load_more_jobs')}
          </Button>
        </div>
      </div>

      <Footer />
      
      <PostJobModal
        open={isPostJobModalOpen}
        onOpenChange={setIsPostJobModalOpen}
        onJobPosted={handleJobPosted}
      />
    </div>
  );
};

export default Jobs;