"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Hourglass, Search, X, FileText, User, Calendar, Paperclip, Info, School, FileX, AlertTriangle, RefreshCcw } from 'lucide-react';
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
  
  useEffect(() => {
    // Live filter as user types, but do not show error if none
    if (searchQuery.trim() === "") {
      setGrievances(allGrievances);
      return;
    }
    const filtered = allGrievances.filter(g =>
      g.grievance_details.subject.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    setGrievances(filtered);
    // Do not set error here
  }, [searchQuery, allGrievances]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a subject to search.");
      return;
    }
    // Only show error if no matches when Search is clicked
    if (grievances.length === 0) {
      setError("No grievances found matching the subject.");
    } else {
      setError(null);
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
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="bg-blue-50 border border-blue-100 rounded-xl shadow px-6 py-6 flex flex-col items-center max-w-xs w-full">
          <AlertTriangle className="w-7 h-7 text-blue-400 mb-2" />
          <p className="text-gray-700 text-center mb-4 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-blue-200 shadow hover:bg-blue-100 transition-colors"
            aria-label="Refresh"
          >
            <RefreshCcw className="w-5 h-5 text-blue-500" />
          </button>
        </div>
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError(null); // Clear error while typing
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by Subject..."
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
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
              Lodge a New Grievance
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
                          <div className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-lg transition-all duration-200 w-full">
                            <button
                              className="absolute top-3 right-3 text-gray-400 hover:text-blue-500 transition"
                              onClick={() => setExpandedGrievance(null)}
                              aria-label="Close details"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-blue-500 font-bold text-lg flex items-center gap-2">
                                <Info className="w-5 h-5" />
                                Grievance Details
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Left: Meta Info */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-blue-400" />
                                  <span className="font-semibold text-gray-700">Subject:</span>
                                  <span className="ml-1 text-gray-900">{grievance.grievance_details.subject}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Info className="w-5 h-5 text-blue-400" />
                                  <span className="font-semibold text-gray-700">Type:</span>
                                  <span className="ml-1 text-gray-900">{grievance.grievance_details.issue_type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-5 h-5 text-blue-400" />
                                  <span className="font-semibold text-gray-700">By:</span>
                                  <span className="ml-1 text-gray-900">{grievance.grievance_details.rollno}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-5 h-5 text-blue-400" />
                                  <span className="font-semibold text-gray-700">Date & Time:</span>
                                  <span className="ml-1 text-gray-900">{new Date(grievance.grievance_details.date_time).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <School className="w-5 h-5 text-blue-400" />
                                  <span className="font-semibold text-gray-700">Campus:</span>
                                  <span className="ml-1 text-gray-900">{grievance.grievance_details.campus}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {grievance.grievance_details.attachment === 'true' ? (
                                    <>
                                      <Paperclip className="w-5 h-5 text-blue-500" />
                                      <button
                                        className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200 font-semibold shadow"
                                        onClick={() => window.open(grievance.grievance_details.attachment!, '_blank')}
                                        type="button"
                                      >
                                        Show Attachment
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <FileX className="w-5 h-5 text-gray-400" />
                                      <span className="font-semibold text-gray-500">No attachment uploaded</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* Right: Description */}
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 h-full flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-5 h-5 text-blue-400" />
                                  <span className="font-semibold text-blue-700 text-base">Description</span>
                                </div>
                                <div className="text-gray-700 whitespace-pre-line text-sm overflow-y-auto max-h-48 pr-2">
                                  {grievance.grievance_details.description}
                                </div>
                              </div>
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
