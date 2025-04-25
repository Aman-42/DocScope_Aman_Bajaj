
import React, { useState } from "react";

interface FilterPanelProps {
  specialties: string[];
  onFilterChange: (filterType: string, value: string | string[]) => void;
  onSortChange: (sortOption: string) => void;
  currentFilters: {
    consultationType: string;
    specialties: string[];
    sortBy: string;
  };
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  specialties,
  onFilterChange,
  onSortChange,
  currentFilters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConsultationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFilterChange("consultationType", e.target.value);
  };

  const handleSpecialtyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const specialty = e.target.value;
    let updatedSpecialties;

    if (currentFilters.specialties.includes(specialty)) {
      updatedSpecialties = currentFilters.specialties.filter(
        (s) => s !== specialty
      );
    } else {
      updatedSpecialties = [...currentFilters.specialties, specialty];
    }

    onFilterChange("specialties", updatedSpecialties);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4 mb-6">
      <button
        className="md:hidden w-full py-2 px-4 bg-primary text-white rounded-md mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Hide Filters" : "Show Filters"}
      </button>

      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        {/* Consultation Type Filter */}
        <div className="mb-6">
          <h3
            data-testid="filter-header-moc"
            className="font-semibold text-lg mb-3 text-gray-700"
          >
            Consultation Type
          </h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="consultationType"
                value="Video Consult"
                checked={currentFilters.consultationType === "Video Consult"}
                onChange={handleConsultationChange}
                data-testid="filter-video-consult"
                className="mr-2"
              />
              Video Consult
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="consultationType"
                value="In Clinic"
                checked={currentFilters.consultationType === "In Clinic"}
                onChange={handleConsultationChange}
                data-testid="filter-in-clinic"
                className="mr-2"
              />
              In Clinic
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="consultationType"
                value=""
                checked={currentFilters.consultationType === ""}
                onChange={handleConsultationChange}
                className="mr-2"
              />
              All Types
            </label>
          </div>
        </div>

        {/* Specialties Filter */}
        <div className="mb-6">
          <h3
            data-testid="filter-header-speciality"
            className="font-semibold text-lg mb-3 text-gray-700"
          >
            Specialties
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {specialties.map((specialty) => (
              <label key={specialty} className="flex items-center">
                <input
                  type="checkbox"
                  value={specialty}
                  checked={currentFilters.specialties.includes(specialty)}
                  onChange={handleSpecialtyChange}
                  data-testid={`filter-specialty-${specialty.replace(/\s+/g, "-")}`}
                  className="mr-2"
                />
                {specialty}
              </label>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h3
            data-testid="filter-header-sort"
            className="font-semibold text-lg mb-3 text-gray-700"
          >
            Sort By
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSortChange("fees")}
              data-testid="sort-fees"
              className={`px-4 py-2 rounded-md ${
                currentFilters.sortBy === "fees"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Fees (Low to High)
            </button>
            <button
              onClick={() => onSortChange("experience")}
              data-testid="sort-experience"
              className={`px-4 py-2 rounded-md ${
                currentFilters.sortBy === "experience"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Experience (High to Low)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
