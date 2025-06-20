'use client'
import React, { useState } from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [newGrievances, setNewGrievances] = useState(0);
  const [pendingGrievances, setPendingGrievances] = useState(0);
  const [resolvedGrievances, setResolvedGrievances] = useState(0);
  const [rejectedGrievances, setRejectedGrievances] = useState(0);

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {/* New Grievances Card */}
        <div className="relative group h-full">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                New Grievances
              </h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {newGrievances}
                </span>
                <span className="text-gray-600 font-medium text-sm sm:text-base">New Cases</span>
              </div>
              <p className="text-gray-600 mb-4 sm:mb-6 font-medium text-sm sm:text-base">
                Grievances awaiting review
              </p>
            </div>
            <Link
              href="/admin/grievance/new"
              className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 sm:px-6 py-2 rounded-md hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              New Grievances
            </Link>
          </div>
        </div>

        {/* Pending Grievances Card */}
        <div className="relative group h-full">
          <div className="absolute bg-orange-400 w-full h-full rounded-lg group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-4">
                Pending Grievances
              </h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {pendingGrievances}
                </span>
                <span className="text-gray-600 font-medium text-sm sm:text-base">In Progress</span>
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Grievances being processed
              </p>
            </div>
            <Link
              href="/admin/grievance/pending"
              className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-2 rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Pending Grievances
            </Link>
          </div>
        </div>

        {/* Resolved Grievances Card */}
        <div className="relative group h-full">
          <div className="absolute bg-green-400 w-full h-full rounded-lg group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                Resolved Grievances
              </h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  {resolvedGrievances}
                </span>
                <span className="text-gray-600 font-medium text-sm sm:text-base">Completed</span>
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Successfully resolved cases
              </p>
            </div>
            <Link
              href="/admin/grievance/resolved"
              className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 rounded-md hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Resolved Grievances
            </Link>
          </div>
        </div>

        {/* Rejected Grievances Card */}
        <div className="relative group h-full">
          <div className="absolute bg-red-400 w-full h-full rounded-lg group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                Rejected Grievances
              </h2>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">
                  {rejectedGrievances}
                </span>
                <span className="text-gray-600 font-medium text-sm sm:text-base">Rejected</span>
              </div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">
                Grievances that were rejected
              </p>
            </div>
            <Link
              href="/admin/grievance/rejected"
              className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 sm:px-6 py-2 rounded-md hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Rejected Grievances
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 