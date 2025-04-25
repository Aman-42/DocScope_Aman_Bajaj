
import { Doctor } from "@/types/doctor";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  // Add safety checks for all properties
  const specialtyText = doctor.specialty && Array.isArray(doctor.specialty) 
    ? doctor.specialty.join(", ") 
    : "Not specified";
  
  // Get doctor initials for avatar fallback
  const getInitials = (name: string): string => {
    if (!name) return "DR";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <div
      data-testid="doctor-card"
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:shadow-lg"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <Avatar className="h-16 w-16 mr-4 border border-gray-200">
            {doctor.imageUrl ? (
              <AvatarImage 
                src={doctor.imageUrl} 
                alt={`Dr. ${doctor.name || "Unknown"}`} 
                onError={(e) => {
                  console.error("Failed to load image:", e);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(doctor.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <h3
              data-testid="doctor-name"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              Dr. {doctor.name || "Unknown"}
            </h3>
            <div data-testid="doctor-specialty" className="mb-2">
              <span className="text-sm text-gray-600">Specialties: </span>
              <span className="font-medium">
                {specialtyText}
              </span>
            </div>
            <div data-testid="doctor-experience" className="mb-2">
              <span className="text-sm text-gray-600">Experience: </span>
              <span className="font-medium">{doctor.experience || 0} years</span>
            </div>
            <div data-testid="doctor-fee" className="mb-2">
              <span className="text-sm text-gray-600">Fee: </span>
              <span className="font-medium">₹{doctor.fee || 0}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.consultationMode && doctor.consultationMode.includes("Video Consult") && (
            <span className="bg-blue-100 text-primary px-2 py-1 rounded-md text-sm">
              Video Consult
            </span>
          )}
          {doctor.consultationMode && doctor.consultationMode.includes("In Clinic") && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm">
              In Clinic
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
