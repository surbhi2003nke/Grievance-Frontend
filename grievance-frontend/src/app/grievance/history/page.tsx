"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Hourglass, Search, X } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

// Updated type to match the new API response structure
type GrievanceResponse = {
  issue_id: string;
  grievance_details: {
    id: number;
    issue_id: string;
    rollno: string;
    campus: string;
    subject: string;
    description: string;
    issue_type: string;
    status: string;
    attachment: string | null;
    date_time: string;
  };
  responses_and_work: {
    responses: any[];
    history: any[];
    attachments: any[];
  };
};

type ApiResponse = {
  message: string;
  data: GrievanceResponse[];
  total_grievances: number;
  success: boolean;
};

// Type for single grievance search response
type SingleGrievanceApiResponse = {
  message: string;
  data: Omit<GrievanceResponse, 'issue_id'>; // data is the grievance object without top-level issue_id
  success: boolean;
};


const History = () => {
  const [allGrievances, setAllGrievances] = useState<GrievanceResponse[]>([]);
  const [grievances, setGrievances] = useState<GrievanceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGrievance, setExpandedGrievance] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { token, user } = useAuth();

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

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('https://grievanceportal.vercel.app/api/v1/grievances/my-grievances', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiResponse: ApiResponse = await response.json();
        
        if (apiResponse.success) {
          setAllGrievances(apiResponse.data);
          setGrievances(apiResponse.data);
        } else {
          throw new Error(apiResponse.message || 'Failed to fetch grievances');
        }
      } catch (error) {
        console.error('Error fetching grievances:', error);
        setError('Failed to load grievance history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchGrievances();
    } else {
      setLoading(false);
      setError('Please login to view your grievance history.');
    }
  }, [token]);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter an Issue ID to search.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("No authentication token found");

      const response = await fetch(`https://grievanceportal.vercel.app/api/v1/grievances/issue/${searchQuery.trim()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Grievance with Issue ID "${searchQuery}" not found.`);
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result: SingleGrievanceApiResponse = await response.json();
      
      if (result.success) {
        const grievanceDetails = result.data.grievance_details;

        // Security check: Ensure the found grievance belongs to the logged-in user
        // by checking it against the list of all grievances fetched for the user.
        const isUsersGrievance = allGrievances.some(g => g.issue_id === grievanceDetails.issue_id);

        if (isUsersGrievance) {
          const formattedGrievance: GrievanceResponse = {
            ...result.data,
            issue_id: grievanceDetails.issue_id,
          };
          setGrievances([formattedGrievance]);
        } else {
          // If the grievance doesn't belong to the user, throw a specific error.
          throw new Error(`This is not your Grievance ID. Please check and try again.`);
        }
      } else {
        throw new Error(result.message || "Failed to find grievance.");
      }
    } catch (err: any) {
      console.error("Error searching grievance:", err);
      setError(err.message);
      setGrievances([]); // Clear table on error
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setGrievances(allGrievances);
    setError(null);
  };


  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
      case 'IN PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

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
        <p className="text-red-500 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-blue-500">
            Grievance History
          </h2>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by Issue ID..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center transform hover:-translate-y-px"
            >
              <Search className="w-4 h-4 mr-2" /> Search
            </button>
            <button
              onClick={handleClearSearch}
              className="bg-white text-gray-700 px-5 py-2.5 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center transform hover:-translate-y-px"
            >
              <X className="w-4 h-4 mr-2" /> Clear
            </button>
          </div>
        </div>

        {grievances.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
            <p className="text-gray-600 text-lg">No grievances found</p>
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
                    Campus
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
                  <React.Fragment key={grievance.issue_id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {grievance.grievance_details.issue_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(grievance.grievance_details.date_time).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grievance.grievance_details.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {grievance.grievance_details.campus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(grievance.grievance_details.status)}`}
                        >
                          {grievance.grievance_details.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-5">
                          <button
                            onClick={() => handleTrack(grievance.issue_id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
                          >
                            <Hourglass className="w-4 h-4 mr-1.5" />
                            Track
                          </button>
                          <button
                            onClick={() => toggleAccordion(grievance.issue_id)}
                            className="text-blue-500 hover:text-blue-600 flex items-center"
                          >
                            <span>View Details</span>
                            <svg
                              className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                                expandedGrievance === grievance.issue_id
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
                    {expandedGrievance === grievance.issue_id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="text-sm text-gray-700">
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <p className="font-medium text-gray-900">Subject:</p>
                                <p className="mt-1">{grievance.grievance_details.subject}</p>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">Description:</p>
                                <p className="mt-1">{grievance.grievance_details.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-900">Issue Type:</p>
                                  <p className="mt-1">{grievance.grievance_details.issue_type}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Campus:</p>
                                  <p className="mt-1">{grievance.grievance_details.campus}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Submitted by:</p>
                                  <p className="mt-1">{grievance.grievance_details.rollno}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Date & Time:</p>
                                  <p className="mt-1">
                                    {new Date(grievance.grievance_details.date_time).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              {grievance.grievance_details.attachment && (
                                <div>
                                  <p className="font-medium text-blue-600">
                                    📎 Has attachment
                                  </p>
                                </div>
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
