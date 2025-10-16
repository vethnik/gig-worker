import { useState } from "react";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WorkerCard from "@/components/WorkerCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Workers = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t('all_workers'));
  const [displayedWorkers, setDisplayedWorkers] = useState(6); // Initially show 6 workers

  // Define filter categories
  const categories = [
    t('all_workers'),
    t('general_laborers'),
    t('carpenters'), 
    t('electricians'),
    t('masons'),
    t('hvac'),
    t('plumbers'),
    t('tile_installers')
  ];

  // Mock worker data
  const workers = [
    {
      name: "Mike Johnson",
      trade: "Master Carpenter",
      location: "Brooklyn, NY",
      rating: 4.9,
      reviewCount: 27,
      skills: ["Framing", "Custom Cabinets", "Finish Work", "Blueprint Reading"],
      yearsExperience: 12,
      phone: "(555) 123-4567",
      email: "mike@example.com"
    },
    {
      name: "Sarah Chen",
      trade: "Licensed Electrician",
      location: "Manhattan, NY",
      rating: 4.8,
      reviewCount: 34,
      skills: ["Commercial Wiring", "Residential", "Code Compliance", "Troubleshooting"],
      yearsExperience: 8,
      phone: "(555) 234-5678",
      email: "sarah@example.com"
    },
    {
      name: "Carlos Rodriguez",
      trade: "Stone Mason",
      location: "Queens, NY",
      rating: 5.0,
      reviewCount: 19,
      skills: ["Natural Stone", "Brick Work", "Restoration", "Custom Design"],
      yearsExperience: 15,
      phone: "(555) 345-6789",
      email: "carlos@example.com"
    },
    {
      name: "David Kim",
      trade: "HVAC Specialist",
      location: "Bronx, NY",
      rating: 4.7,
      reviewCount: 22,
      skills: ["Installation", "Maintenance", "Commercial Systems", "EPA Certified"],
      yearsExperience: 10,
      phone: "(555) 456-7890",
      email: "david@example.com"
    },
    {
      name: "Amanda Thompson",
      trade: "Master Plumber",
      location: "Staten Island, NY",
      rating: 4.9,
      reviewCount: 31,
      skills: ["Residential Plumbing", "Emergency Repair", "Pipe Installation", "Water Heaters"],
      yearsExperience: 14,
      phone: "(555) 567-8901",
      email: "amanda@example.com"
    },
    {
      name: "Robert Wilson",
      trade: "Tile Installer",
      location: "Long Island, NY",
      rating: 4.6,
      reviewCount: 16,
      skills: ["Ceramic Tile", "Natural Stone", "Bathroom Remodel", "Commercial"],
      yearsExperience: 9,
      phone: "(555) 678-9012",
      email: "robert@example.com"
    },
    {
      name: "Jennifer Garcia",
      trade: "Master Carpenter",
      location: "Jersey City, NJ",
      rating: 4.8,
      reviewCount: 25,
      skills: ["Kitchen Renovation", "Built-ins", "Hardwood Flooring", "Trim Work"],
      yearsExperience: 11,
      phone: "(555) 789-0123",
      email: "jennifer@example.com"
    },
    {
      name: "Michael Brown",
      trade: "Licensed Electrician",
      location: "Newark, NJ",
      rating: 4.9,
      reviewCount: 42,
      skills: ["Solar Installation", "Smart Home Systems", "Industrial Wiring", "LED Conversion"],
      yearsExperience: 16,
      phone: "(555) 890-1234",
      email: "michael@example.com"
    },
    {
      name: "Lisa Anderson",
      trade: "HVAC Specialist",
      location: "Yonkers, NY",
      rating: 4.7,
      reviewCount: 28,
      skills: ["Heat Pump Installation", "Ductwork", "Energy Efficiency", "Repair Service"],
      yearsExperience: 13,
      phone: "(555) 901-2345",
      email: "lisa@example.com"
    },
    {
      name: "Tony Martinez",
      trade: "Stone Mason",
      location: "White Plains, NY",
      rating: 5.0,
      reviewCount: 35,
      skills: ["Outdoor Patios", "Fireplaces", "Retaining Walls", "Stone Veneer"],
      yearsExperience: 18,
      phone: "(555) 012-3456",
      email: "tony@example.com"
    },
    {
      name: "Rachel Davis",
      trade: "Master Plumber",
      location: "Hoboken, NJ",
      rating: 4.8,
      reviewCount: 29,
      skills: ["Bathroom Renovation", "Kitchen Plumbing", "Leak Detection", "Drain Cleaning"],
      yearsExperience: 12,
      phone: "(555) 123-4567",
      email: "rachel@example.com"
    },
    {
      name: "Kevin O'Connor",
      trade: "Tile Installer",
      location: "New Rochelle, NY",
      rating: 4.6,
      reviewCount: 21,
      skills: ["Mosaic Design", "Waterproofing", "Floor Heating", "Shower Installation"],
      yearsExperience: 10,
      phone: "(555) 234-5678",
      email: "kevin@example.com"
    },
    {
      name: "James Thompson",
      trade: "Construction Laborer",
      location: "Brooklyn, NY",
      rating: 4.7,
      reviewCount: 18,
      skills: ["Material Handling", "Site Preparation", "Tool Assistance", "Scaffolding Assembly"],
      yearsExperience: 5,
      phone: "(555) 345-6789",
      email: "james@example.com"
    },
    {
      name: "Maria Sanchez",
      trade: "Warehouse Worker",
      location: "Queens, NY",
      rating: 4.8,
      reviewCount: 24,
      skills: ["Packing & Sorting", "Forklift Operation", "Inventory Management", "Loading/Unloading"],
      yearsExperience: 6,
      phone: "(555) 456-7890",
      email: "maria@example.com"
    },
    {
      name: "John Davis",
      trade: "Landscaping Helper",
      location: "Staten Island, NY",
      rating: 4.6,
      reviewCount: 15,
      skills: ["Lawn Mowing", "Hedge Trimming", "Planting", "Debris Removal"],
      yearsExperience: 4,
      phone: "(555) 567-8901",
      email: "john@example.com"
    },
    {
      name: "Patricia Lee",
      trade: "Manufacturing Worker",
      location: "Bronx, NY",
      rating: 4.5,
      reviewCount: 20,
      skills: ["Assembly Line", "Quality Control", "Machine Operation", "Packaging"],
      yearsExperience: 7,
      phone: "(555) 678-9012",
      email: "patricia@example.com"
    },
    {
      name: "Robert Jackson",
      trade: "Janitorial Worker",
      location: "Manhattan, NY",
      rating: 4.9,
      reviewCount: 32,
      skills: ["Commercial Cleaning", "Floor Maintenance", "Waste Management", "Minor Repairs"],
      yearsExperience: 8,
      phone: "(555) 789-0123",
      email: "robert.j@example.com"
    },
    {
      name: "Miguel Hernandez",
      trade: "Farm Laborer",
      location: "Long Island, NY",
      rating: 4.7,
      reviewCount: 12,
      skills: ["Harvesting", "Planting", "Crop Maintenance", "Livestock Care"],
      yearsExperience: 9,
      phone: "(555) 890-1234",
      email: "miguel@example.com"
    },
    {
      name: "Emily White",
      trade: "Event Setup Crew",
      location: "Jersey City, NJ",
      rating: 4.6,
      reviewCount: 16,
      skills: ["Event Setup", "Equipment Assembly", "Crowd Control", "Breakdown Services"],
      yearsExperience: 3,
      phone: "(555) 901-2345",
      email: "emily@example.com"
    },
    {
      name: "David Martinez",
      trade: "Construction Helper",
      location: "Newark, NJ",
      rating: 4.8,
      reviewCount: 22,
      skills: ["Concrete Mixing", "Trench Digging", "Debris Cleanup", "Assisting Tradespeople"],
      yearsExperience: 6,
      phone: "(555) 012-3456",
      email: "david.m@example.com"
    },
    {
      name: "Linda Brown",
      trade: "General Laborer",
      location: "Yonkers, NY",
      rating: 4.5,
      reviewCount: 14,
      skills: ["Physical Work", "Team Collaboration", "Tool Handling", "Site Safety"],
      yearsExperience: 4,
      phone: "(555) 123-4567",
      email: "linda@example.com"
    },
    {
      name: "Carlos Ruiz",
      trade: "Warehouse Laborer",
      location: "White Plains, NY",
      rating: 4.7,
      reviewCount: 19,
      skills: ["Stock Organization", "Package Handling", "Shipping & Receiving", "Inventory Counting"],
      yearsExperience: 5,
      phone: "(555) 234-5678",
      email: "carlos.r@example.com"
    },
    {
      name: "Angela Moore",
      trade: "Groundskeeper",
      location: "Hoboken, NJ",
      rating: 4.6,
      reviewCount: 17,
      skills: ["Yard Maintenance", "Mulch Spreading", "Basic Irrigation", "Outdoor Cleanup"],
      yearsExperience: 5,
      phone: "(555) 345-6789",
      email: "angela@example.com"
    },
    {
      name: "Jose Garcia",
      trade: "Factory Worker",
      location: "New Rochelle, NY",
      rating: 4.8,
      reviewCount: 25,
      skills: ["Production Line", "Equipment Cleaning", "Safety Compliance", "Product Inspection"],
      yearsExperience: 8,
      phone: "(555) 456-7890",
      email: "jose@example.com"
    }
  ];

  // Filter workers based on selected category and search term
  const filteredWorkers = workers.filter(worker => {
    const tradeLower = worker.trade.toLowerCase();
    const matchesCategory = selectedCategory === t('all_workers') || 
      tradeLower.includes(selectedCategory.toLowerCase().slice(0, -1)) || // Remove 's' from plural
      (selectedCategory === t('carpenters') && tradeLower.includes("carpenter")) ||
      (selectedCategory === t('electricians') && tradeLower.includes("electrician")) ||
      (selectedCategory === t('masons') && tradeLower.includes("mason")) ||
      (selectedCategory === t('hvac') && tradeLower.includes("hvac")) ||
      (selectedCategory === t('plumbers') && tradeLower.includes("plumber")) ||
      (selectedCategory === t('tile_installers') && tradeLower.includes("tile")) ||
      (selectedCategory === t('general_laborers') && (
        tradeLower.includes("laborer") || 
        tradeLower.includes("warehouse") || 
        tradeLower.includes("landscaping") ||
        tradeLower.includes("manufacturing") ||
        tradeLower.includes("janitorial") ||
        tradeLower.includes("farm") ||
        tradeLower.includes("event") ||
        tradeLower.includes("helper") ||
        tradeLower.includes("groundskeeper") ||
        tradeLower.includes("factory") ||
        tradeLower.includes("cleaning")
      ));
    
    const matchesSearch = searchTerm === "" || 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === "" ||
      worker.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesCategory && matchesSearch && matchesLocation;
  });

  // Get workers to display based on current limit
  const workersToShow = filteredWorkers.slice(0, displayedWorkers);
  const hasMoreWorkers = filteredWorkers.length > displayedWorkers;

  const loadMoreWorkers = () => {
    setDisplayedWorkers(prev => Math.min(prev + 6, filteredWorkers.length));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t('find_skilled_workers')}</h1>
          <p className="text-xl text-muted-foreground">{t('connect_with_qualified_professionals')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t('search_workers_placeholder')}
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
            {t('skilled_workers_found', { count: filteredWorkers.length })}
            {selectedCategory !== t('all_workers') && (
              <span className="ml-2 text-primary">
                {t('filtered_by', { category: selectedCategory })}
              </span>
            )}
          </p>
          <select className="bg-background border border-border rounded-md px-3 py-2 text-sm">
            <option>{t('highest_rated')}</option>
            <option>Most Experience</option>
            <option>Most Reviews</option>
            <option>{t('closest_distance')}</option>
          </select>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkers.length > 0 ? (
            workersToShow.map((worker, index) => (
              <WorkerCard key={index} {...worker} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No workers found matching your criteria
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory(t('all_workers'));
                  setSearchTerm("");
                  setLocationFilter("");
                  setDisplayedWorkers(6);
                }}
              >
                {t('clear_filters')}
              </Button>
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMoreWorkers && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={loadMoreWorkers}>
              Load More Workers ({filteredWorkers.length - displayedWorkers} remaining)
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Workers;