'use client'
import React, { useState } from "react";
import Link from "next/link";

const StudentDashboard = () => {
  const [pendingGrievancenumber, setPendingGrievnacenumber] = useState(0);
  const [resolvedGrievancenumber, setResolvedGrievnacenumber] = useState(0);

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* New Grievance Card */}
        <div className="relative group h-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                New Grievance
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 font-medium text-sm sm:text-base">
                Have a new issue to report? Lodge your grievance here.
              </p>
            </div>
            <Link
              href="/grievance/lodge"
              className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Lodge Grievance
            </Link>
          </div>
        </div>

        {/* Pending Grievances Card */}
        <div className="relative group h-full">
          <div className="absolute bg-orange-400 w-full h-full rounded-lg group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-4">
              Pending Grievances
            </h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {pendingGrievancenumber}
              </span>
              <span className="text-gray-600 font-medium text-sm sm:text-base">Active Cases</span>
            </div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              Your grievances are being processed
            </p>
          </div>
        </div>

        {/* Resolved Grievances Card */}
        <div className="relative group h-full">
          <div className="absolute bg-green-400 w-full h-full rounded-lg group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Resolved Grievances
            </h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {resolvedGrievancenumber}
              </span>
              <span className="text-gray-600 font-medium text-sm sm:text-base">Completed Cases</span>
            </div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">
              Successfully resolved issues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 