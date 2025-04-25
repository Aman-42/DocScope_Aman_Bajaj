
export interface Doctor {
  id: string;
  name: string;
  specialty: string[];
  experience: number;
  fee: number;
  consultationMode: string[];
  imageUrl?: string; // Add imageUrl property
}

export interface FilterState {
  searchTerm: string;
  consultationType: string;
  specialties: string[];
  sortBy: string;
}
