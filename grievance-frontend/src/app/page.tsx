"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [pendingGrievancenumber, setPendingGrievnacenumber] = useState(0);
  const [resolvedGrievancenumber, setResolvedGrievnacenumber] = useState(0);

  return (
    <div className="min-h-fit p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* New Grievance Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              New Grievance
            </h2>
            <p className="text-gray-600 mb-6 font-medium">
              Have a new issue to report? Lodge your grievance here.
            </p>
            <Link
              href="/grievance/lodge"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Lodge Grievance
            </Link>
          </div>
        </div>

        {/* Pending Grievances Card */}
        <div className="relative group">
          <div className="absolute bg-orange-400 min-h-52 w-full rounded-lg hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg min-h-52 p-6 border border-gray-100 hover:shadow-2xs hover:-translate-y-2.5 transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              Pending Grievances
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {pendingGrievancenumber}
              </span>
              <span className="text-gray-600 font-medium">Active Cases</span>
            </div>
            <p className="text-gray-600 mt-6 font-medium">
              Your grievances are being processed
            </p>
          </div>
        </div>

        {/* Resolved Grievances Card */}
        <div className="relative group">
          <div className="absolute bg-green-400 min-h-52 w-full rounded-lg group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-lg min-h-52 p-6 border border-gray-100 hover:shadow-xs hover:-translate-y-2.5 transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">
              Resolved Grievances
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                {resolvedGrievancenumber}
              </span>
              <span className="text-gray-600 font-medium">Completed Cases</span>
            </div>
            <p className="text-gray-600 mt-6 font-medium">
              Successfully resolved issues
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
