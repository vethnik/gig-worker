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
  const [selectedCategory, setSelectedCategory] = useState(t('all_jobs'));
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Define filter categories
  const categories = [
    t('all_jobs'),
    t('construction_related_work'),
    t('loading_unloading'),
    t('household_work'),
    t('outdoor_agricultural_work'),
    t('small_contract_work'),
  ];

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

  // Filter jobs based on selected category and search term
  const filteredJobs = jobs.filter((job) => {
    const matchesCategory =
      selectedCategory === t('all_jobs') ||
      job.category === selectedCategory ||
      job.title.toLowerCase().includes(selectedCategory.toLowerCase());

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
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {t('showing_jobs_in_area', { count: filteredJobs.length })}
            {selectedCategory !== t('all_jobs') && (
              <span className="ml-2 text-primary">
                {t('filtered_by', { category: selectedCategory })}
              </span>
            )}
          </p>
          <select className="bg-background border border-border rounded-md px-3 py-2 text-sm">
            <option>{t('most_recent')}</option>
            <option>{t('highest_pay')}</option>
            <option>{t('closest_distance')}</option>
          </select>
        </div>

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
                  setSelectedCategory(t('all_jobs'));
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