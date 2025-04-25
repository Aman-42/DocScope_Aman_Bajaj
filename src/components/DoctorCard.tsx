
import { Doctor } from "@/types/doctor";
import React from "react";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div
      data-testid="doctor-card"
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-transform hover:shadow-lg"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3
              data-testid="doctor-name"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              Dr. {doctor.name}
            </h3>
            <div data-testid="doctor-specialty" className="mb-2">
              <span className="text-sm text-gray-600">Specialties: </span>
              <span className="font-medium">
                {doctor.specialty.join(", ")}
              </span>
            </div>
            <div data-testid="doctor-experience" className="mb-2">
              <span className="text-sm text-gray-600">Experience: </span>
              <span className="font-medium">{doctor.experience} years</span>
            </div>
            <div data-testid="doctor-fee" className="mb-2">
              <span className="text-sm text-gray-600">Fee: </span>
              <span className="font-medium">₹{doctor.fee}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.consultationMode.includes("Video Consult") && (
            <span className="bg-blue-100 text-primary px-2 py-1 rounded-md text-sm">
              Video Consult
            </span>
          )}
          {doctor.consultationMode.includes("In Clinic") && (
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
