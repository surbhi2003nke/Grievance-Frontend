"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Hourglass } from 'lucide-react';

// Match the type with the API
type Grievance = {
  Name: string;
  roll_no: string;
  issueId: string;
  programid: number;
  campusid: number;
  subject: string;
  description: string;
  issueType: string;
  status: string;
  date: string;
  time: string;
  attachment: boolean;
};

const History = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGrievance, setExpandedGrievance] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedGrievance(expandedGrievance === id ? null : id);
  };

  const handleTrack = (id: string) => {
    // Add tracking functionality here
    console.log("Tracking grievance:", id);
  };

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/lodged');  // Updated to use correct endpoint
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setGrievances(data);
      } catch (error) {
        console.error('Error fetching grievances:', error);
        setError('Failed to load grievance history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-500">
            Grievance History
          </h2>
          {/* <Link 
            href="/grievance/lodge"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Lodge New Grievance
          </Link> */}
        </div>

        {grievances.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <p className="text-gray-600 text-lg">No grievances listed</p>
            <Link
              href="/grievance/lodge"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              Lodge Your First Grievance
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grievances.map((grievance) => (
                  <React.Fragment key={grievance.issueId}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {grievance.issueId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(grievance.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {grievance.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            grievance.status === "Resolved"
                              ? "bg-green-100 text-green-800"
                              : grievance.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {grievance.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-5">
                          <button
                            onClick={() => handleTrack(grievance.issueId)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
                          >
                            <Hourglass className="w-4 h-4 mr-1.5" />
                            Track
                          </button>
                          <button
                            onClick={() => toggleAccordion(grievance.issueId)}
                            className="text-blue-500 hover:text-blue-600 flex items-center"
                          >
                            <span>View Details</span>
                            <svg
                              className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                                expandedGrievance === grievance.issueId
                                  ? "rotate-180"
                                  : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedGrievance === grievance.issueId && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                          <div className="text-sm text-gray-700">
                            <div className="flex gap-2.5">
                              <p className="font-medium mb-2">Subject:</p>
                              <p className="mb-4">{grievance.subject}</p>
                            </div>
                            <div className="flex gap-2.5">
                              <p className="font-medium mb-2">Description:</p>
                              <p className="mb-4">{grievance.description}</p>
                            </div>
                            <div className="flex gap-2.5">
                              <p className="font-medium mb-2">Submitted by:</p>
                              <p>{grievance.Name} ({grievance.roll_no})</p>
                              {grievance.attachment && (
                                <p className=" text-blue-500">
                                  Has attachment
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
