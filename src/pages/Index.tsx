
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import FilterPanel from "@/components/FilterPanel";
import DoctorList from "@/components/DoctorList";
import { Doctor, FilterState } from "@/types/doctor";
import { fetchDoctors } from "@/services/doctorService";

const Index: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    consultationType: "",
    specialties: [],
    sortBy: "",
  });

  // Parse query parameters from URL when the component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    setFilters({
      searchTerm: queryParams.get("search") || "",
      consultationType: queryParams.get("type") || "",
      specialties: queryParams.get("specialties") 
        ? queryParams.get("specialties")!.split(",") 
        : [],
      sortBy: queryParams.get("sort") || "",
    });
  }, [location.search]);

  // Fetch doctors data when the component mounts
  useEffect(() => {
    const getDoctors = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDoctors();
        setDoctors(data);

        // Extract unique specialties
        const specialties = new Set<string>();
        data.forEach((doctor) => {
          doctor.specialty.forEach((spec) => specialties.add(spec));
        });
        setAllSpecialties(Array.from(specialties).sort());
        
        setError(null);
      } catch (err) {
        setError("Failed to load doctors. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getDoctors();
  }, []);

  // Apply filters and sorting whenever doctors or filters change
  useEffect(() => {
    if (!doctors.length) return;

    let result = [...doctors];

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm) ||
          doctor.specialty.some((spec) =>
            spec.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Apply consultation type filter
    if (filters.consultationType) {
      result = result.filter((doctor) =>
        doctor.consultationMode.includes(filters.consultationType)
      );
    }

    // Apply specialty filters
    if (filters.specialties.length > 0) {
      result = result.filter((doctor) =>
        doctor.specialty.some((spec) => filters.specialties.includes(spec))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      if (filters.sortBy === "fees") {
        result.sort((a, b) => a.fee - b.fee);
      } else if (filters.sortBy === "experience") {
        result.sort((a, b) => b.experience - a.experience);
      }
    }

    setFilteredDoctors(result);
  }, [doctors, filters]);

  // Update URL with current filter state
  useEffect(() => {
    const queryParams = new URLSearchParams();
    
    if (filters.searchTerm) {
      queryParams.set("search", filters.searchTerm);
    }
    
    if (filters.consultationType) {
      queryParams.set("type", filters.consultationType);
    }
    
    if (filters.specialties.length > 0) {
      queryParams.set("specialties", filters.specialties.join(","));
    }
    
    if (filters.sortBy) {
      queryParams.set("sort", filters.sortBy);
    }
    
    const newSearch = queryParams.toString() ? `?${queryParams.toString()}` : "";
    navigate({
      pathname: location.pathname,
      search: newSearch,
    }, { replace: true });
  }, [filters, navigate, location.pathname]);

  const handleSearch = (term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term }));
  };

  const handleFilterChange = (filterType: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleSortChange = (sortOption: string) => {
    setFilters((prev) => ({ ...prev, sortBy: sortOption }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onSearch={handleSearch} 
        doctors={doctors} 
        searchTerm={filters.searchTerm}
      />
      
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Doctors</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <FilterPanel
                specialties={allSpecialties}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                currentFilters={{
                  consultationType: filters.consultationType,
                  specialties: filters.specialties,
                  sortBy: filters.sortBy,
                }}
              />
            </div>
            <div className="md:col-span-3">
              <div className="mb-4">
                <p className="text-gray-600">
                  {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} found
                </p>
              </div>
              <DoctorList doctors={filteredDoctors} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
