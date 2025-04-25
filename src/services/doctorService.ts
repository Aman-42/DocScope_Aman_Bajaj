
import { Doctor } from "@/types/doctor";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

// Helper function to extract numeric value from experience string
const extractExperienceYears = (experienceText: string): number => {
  const match = experienceText?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

// Helper function to extract numeric fee value
const extractFee = (feeText: string): number => {
  const match = feeText?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch doctors: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API Response:", data); // Log the API response
    
    // Transform API data to match our Doctor interface
    return data.map((doctor: any) => ({
      id: doctor.id || String(Math.random()),
      name: doctor.name || "",
      specialty: doctor.specialities ? doctor.specialities.map((spec: any) => spec.name || "") : [],
      experience: extractExperienceYears(doctor.experience || "0 Years of experience"),
      fee: extractFee(doctor.fees || "₹ 0"),
      consultationMode: [
        ...(doctor.video_consult ? ["Video Consult"] : []),
        ...(doctor.in_clinic ? ["In Clinic"] : [])
      ],
      imageUrl: doctor.photo || "" // Use the photo field from API response
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};
