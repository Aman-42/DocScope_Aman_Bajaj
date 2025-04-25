
import React from "react";
import { Doctor } from "@/types/doctor";
import DoctorCard from "./DoctorCard";

interface DoctorListProps {
  doctors: Doctor[];
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors }) => {
  if (doctors.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-gray-500">No doctors found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
