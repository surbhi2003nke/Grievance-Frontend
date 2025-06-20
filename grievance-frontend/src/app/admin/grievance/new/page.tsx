"use client";

import React, { useState, useEffect } from "react";
import { StudentInfo } from "@/app/api/student-info/route";
import { Grievance } from "@/app/admin/api/new-lodged-grievances/route";
import { AcademicInfo } from "@/app/api/academic-info/route";

const Page = () => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [studentInfos, setStudentInfos] = useState<Record<string, StudentInfo>>({});
  const [academicInfos, setAcademicInfos] = useState<Record<string, AcademicInfo>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Fetch all grievances 
  const fetchGrievances = async (): Promise<Grievance[]> => {
    const res = await fetch("/admin/api/new-lodged-grievances");
    if (!res.ok) throw new Error("Failed to fetch grievances");
    const data = await res.json();
    return Array.isArray(data) ? data : data.grievances || [];
  };

  // Fetch student info by roll_no
  const fetchStudentInfo = async (roll_no: string): Promise<StudentInfo> => {
    const res = await fetch(`/api/student-info?roll_no=${roll_no}`);
    if (!res.ok) throw new Error(`Failed to fetch student info for roll_no: ${roll_no}`);
    const data = await res.json();
    return data.student ?? data;
  };

  // Fetch academic info by roll_no
  const fetchAcademicInfo = async (roll_no: string): Promise<AcademicInfo> => {
    const res = await fetch(`/api/academic-info?roll_no=${roll_no}`);
    if (!res.ok) throw new Error(`Failed to fetch academic info for roll_no: ${roll_no}`);
    const data = await res.json();
    return data.academic ?? data;
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        const fetchedGrievances = await fetchGrievances();
        setGrievances(fetchedGrievances);

        // Fetch all student and academic info in parallel
        const studentInfoResults = await Promise.all(
          fetchedGrievances.map((g) => fetchStudentInfo(g.roll_no))
        );
        const academicInfoResults = await Promise.all(
          fetchedGrievances.map((g) => fetchAcademicInfo(g.roll_no))
        );

        // Map roll_no to info for quick lookup
        const studentInfoMap: Record<string, StudentInfo> = {};
        const academicInfoMap: Record<string, AcademicInfo> = {};
        fetchedGrievances.forEach((g, i) => {
          studentInfoMap[g.roll_no] = studentInfoResults[i];
          academicInfoMap[g.roll_no] = academicInfoResults[i];
        });

        setStudentInfos(studentInfoMap);
        setAcademicInfos(academicInfoMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">New Grievances</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Roll No</th>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Campus ID</th>
            <th className="border px-4 py-2">Program ID</th>
            <th className="border px-4 py-2">Issue ID</th>
            <th className="border px-4 py-2">Subject</th>
            <th className="border px-4 py-2">Expand</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map((grievance) => (
            <React.Fragment key={grievance.issueId}>
              <tr>
                <td className="border px-4 py-2">{grievance.roll_no}</td>
                <td className="border px-4 py-2">
                  {studentInfos[grievance.roll_no]?.name || ""}
                </td>
                <td className="border px-4 py-2">
                  {academicInfos[grievance.roll_no]?.campusid || ""}
                </td>
                <td className="border px-4 py-2">
                  {academicInfos[grievance.roll_no]?.programid || ""}
                </td>
                <td className="border px-4 py-2">{grievance.issueId}</td>
                <td className="border px-4 py-2">{grievance.subject}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() =>
                      setExpanded(expanded === grievance.roll_no ? null : grievance.roll_no)
                    }
                    className="text-blue-500 underline"
                  >
                    {expanded === grievance.roll_no ? "Collapse" : "Expand"}
                  </button>
                </td>
              </tr>
              {expanded === grievance.roll_no && (
                <tr>
                  <td colSpan={7} className="border px-4 py-2 bg-gray-50">
                    <div>
                      <div>
                        <strong>Description:</strong> {grievance.description}
                      </div>
                      <div>
                        <strong>Issue Type:</strong> {grievance.issueType}
                      </div>
                      <div>
                        <strong>Status:</strong> {grievance.status}
                      </div>
                      <div>
                        <strong>Date:</strong> {new Date(grievance.date).toLocaleDateString()}
                        {" | "}
                        <strong>Time:</strong> {new Date(grievance.time).toLocaleTimeString()}
                      </div>
                      <div>
                        <strong>Attachment:</strong> {grievance.attachment ? "Yes" : "No"}
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
  );
};

export default Page;