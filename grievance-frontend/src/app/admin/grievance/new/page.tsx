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

  // Fetch student info by rollno
  const fetchStudentInfo = async (rollno: string): Promise<StudentInfo> => {
    const res = await fetch(`/api/student-info?rollno=${rollno}`);
    if (!res.ok) throw new Error(`Failed to fetch student info for rollno: ${rollno}`);
    const data = await res.json();
    return data.student ?? data;
  };

  // Fetch academic info by rollno
  const fetchAcademicInfo = async (rollno: string): Promise<AcademicInfo> => {
    const res = await fetch(`/api/academic-info?rollno=${rollno}`);
    if (!res.ok) throw new Error(`Failed to fetch academic info for rollno: ${rollno}`);
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
          fetchedGrievances.map((g) => fetchStudentInfo(g.rollno))
        );
        const academicInfoResults = await Promise.all(
          fetchedGrievances.map((g) => fetchAcademicInfo(g.rollno))
        );

        // Map rollno to info for quick lookup
        const studentInfoMap: Record<string, StudentInfo> = {};
        const academicInfoMap: Record<string, AcademicInfo> = {};
        fetchedGrievances.forEach((g, i) => {
          studentInfoMap[g.rollno] = studentInfoResults[i];
          academicInfoMap[g.rollno] = academicInfoResults[i];
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
      <div className="flex flex-col gap-4">
        {grievances.map((grievance) => (
          <div
            key={grievance.issueId}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <span className="font-semibold">Roll No:</span> {grievance.rollno}
              </div>
              <div>
                <span className="font-semibold">Student Name:</span>{" "}
                {studentInfos[grievance.rollno]?.name || ""}
              </div>
              <div>
                <span className="font-semibold">Campus ID:</span>{" "}
                {academicInfos[grievance.rollno]?.campusid || ""}
              </div>
              <div>
                <span className="font-semibold">Program ID:</span>{" "}
                {academicInfos[grievance.rollno]?.programid || ""}
              </div>
              <div>
                <span className="font-semibold">Issue ID:</span> {grievance.issueId}
              </div>
              <div>
                <span className="font-semibold">Subject:</span> {grievance.subject}
              </div>
              <button
                onClick={() =>
                  setExpanded(expanded === grievance.rollno ? null : grievance.rollno)
                }
                className="text-blue-500 underline ml-auto"
              >
                {expanded === grievance.rollno ? "Collapse" : "Expand"}
              </button>
            </div>
            {expanded === grievance.rollno && (
              <div className="mt-4 bg-gray-50 rounded p-3">
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;