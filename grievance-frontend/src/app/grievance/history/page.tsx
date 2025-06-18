"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Activity } from "lucide-react";

interface Grievance {
  id: number;
  date: string;
  type: string;
  status: string;
  description: string;
}

const History = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGrievance, setExpandedGrievance] = useState<number | null>(
    null
  );

  const toggleAccordion = (id: number) => {
    setExpandedGrievance(expandedGrievance === id ? null : id);
  };

  const handleTrack = (id: number) => {
    // Add tracking functionality here
    console.log("Tracking grievance:", id);
  };

  React.useEffect(() => {
    setTimeout(() => {
      setGrievances([
        {
          id: 1,
          date: "2024-03-20",
          type: "Academic",
          status: "Pending",
          description: "Issue with course registration for semester 6",
        },
        {
          id: 2,
          date: "2024-03-18",
          type: "Infrastructure",
          status: "In Progress",
          description: "Air conditioning not working in Computer Lab 3",
        },
        {
          id: 3,
          date: "2024-03-15",
          type: "Administrative",
          status: "Resolved",
          description: "Request for duplicate ID card",
        },
        {
          id: 4,
          date: "2024-03-10",
          type: "Academic",
          status: "Pending",
          description: "Request for revaluation of exam papers",
        },
        {
          id: 5,
          date: "2024-03-05",
          type: "Financial",
          status: "Resolved",
          description: "Scholarship disbursement delay",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                    Sr. No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                {grievances.map((grievance, index) => (
                  <React.Fragment key={grievance.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(grievance.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {grievance.type}
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
                            onClick={() => handleTrack(grievance.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
                          >
                            <Activity className="w-4 h-4 mr-1.5" />
                            Track
                          </button>
                          <button
                            onClick={() => toggleAccordion(grievance.id)}
                            className="text-blue-500 hover:text-blue-600 flex items-center"
                          >
                            <span>View Details</span>
                            <svg
                              className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${
                                expandedGrievance === grievance.id
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
                    {expandedGrievance === grievance.id && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50">
                          <div className="text-sm text-gray-700">
                            <p className="font-medium mb-2">Description:</p>
                            <p>{grievance.description}</p>
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
