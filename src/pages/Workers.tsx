import { useState, useEffect } from "react";
import { Search, MapPin, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WorkerCard from "@/components/WorkerCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CreateWorkerProfileModal from "@/components/CreateWorkerProfileModal";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type WorkerProfile = Tables<"worker_profiles">;

const WORKERS_PER_PAGE = 6;

const Workers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all_workers");
  const [displayedCount, setDisplayedCount] = useState(WORKERS_PER_PAGE);
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryKeys = [
    "all_workers",
    "general_laborers",
    "carpenters",
    "electricians",
    "masons",
    "hvac",
    "plumbers",
    "tile_installers",
  ];

  const categories = categoryKeys.map((key) => ({ key, label: t(key) }));

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("worker_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorkers(data ?? []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load worker profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const workerMatchesCategory = (worker: WorkerProfile, categoryKey: string): boolean => {
    if (categoryKey === "all_workers") return true;
    const trade = worker.trade.toLowerCase();

    const map: Record<string, string[]> = {
      carpenters: ["carpenter"],
      electricians: ["electrician"],
      masons: ["mason", "stone"],
      hvac: ["hvac"],
      plumbers: ["plumber"],
      tile_installers: ["tile"],
      general_laborers: [
        "laborer", "warehouse", "landscaping", "manufacturing",
        "janitorial", "farm", "event", "helper", "groundskeeper",
        "factory", "cleaning", "general",
      ],
    };

    return (map[categoryKey] ?? []).some((kw) => trade.includes(kw));
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesCategory = workerMatchesCategory(worker, selectedCategory);

    const matchesSearch =
      searchTerm === "" ||
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesLocation =
      locationFilter === "" ||
      worker.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesCategory && matchesSearch && matchesLocation;
  });

  const workersToShow = filteredWorkers.slice(0, displayedCount);
  const hasMore = filteredWorkers.length > displayedCount;

  const handleProfileCreated = () => {
    fetchWorkers();
    toast({
      title: "Profile Added!",
      description: "Your worker profile is now visible to employers.",
    });
    setSelectedCategory("all_workers");
    setSearchTerm("");
    setLocationFilter("");
    setDisplayedCount(WORKERS_PER_PAGE);
  };

  const clearFilters = () => {
    setSelectedCategory("all_workers");
    setSearchTerm("");
    setLocationFilter("");
    setDisplayedCount(WORKERS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-10 bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Hire Talent</p>
          <h1 className="text-4xl font-black text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
            {t("find_skilled_workers")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("connect_with_qualified_professionals")}
          </p>
        </div>
      </div>

      {/* Create Worker Profile Banner */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-primary/8 to-accent/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-md shrink-0">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black text-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {t("are_you_skilled_worker")}
                </h2>
                <p className="text-sm text-muted-foreground">{t("create_profile_description")}</p>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setIsCreateProfileModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white shadow-md gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              {t("create_worker_profile")}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="mb-8 bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("search_workers_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 rounded-xl border-border"
              />
            </div>
            <div className="relative md:w-56">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("location")}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10 h-11 rounded-xl border-border"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => {
                  setSelectedCategory(category.key);
                  setDisplayedCount(WORKERS_PER_PAGE);
                }}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  selectedCategory === category.key
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-muted-foreground">
            {loading
              ? "Loading workers..."
              : t("skilled_workers_found", { count: filteredWorkers.length })}
            {!loading && selectedCategory !== "all_workers" && (
              <span className="ml-2 text-primary">
                {t("filtered_by", { category: t(selectedCategory) })}
              </span>
            )}
          </p>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">Loading workers...</p>
            </div>
          ) : workersToShow.length > 0 ? (
            workersToShow.map((worker) => (
              <WorkerCard
                key={worker.id}
                name={worker.name}
                trade={worker.trade}
                location={worker.location}
                rating={worker.rating}
                reviewCount={worker.review_count}
                skills={worker.skills}
                yearsExperience={worker.years_experience}
                phone={worker.phone}
                email={worker.email}
                bio={worker.bio}
                hourlyRate={worker.hourly_rate}
                availability={worker.availability}
                certifications={worker.certifications}
                previousWork={worker.previous_work}
                languages={worker.languages}
                avatar={worker.avatar_url ?? undefined}
                createdAt={worker.created_at}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No workers found matching your criteria
              </p>
              <Button variant="outline" onClick={clearFilters}>
                {t("clear_filters")}
              </Button>
            </div>
          )}
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setDisplayedCount((prev) => prev + WORKERS_PER_PAGE)}
            >
              Load More Workers ({filteredWorkers.length - displayedCount} remaining)
            </Button>
          </div>
        )}
      </div>

      <Footer />

      <CreateWorkerProfileModal
        open={isCreateProfileModalOpen}
        onOpenChange={setIsCreateProfileModalOpen}
        onProfileCreated={handleProfileCreated}
      />
    </div>
  );
};

export default Workers;
