"use client";

import React, { useState, useEffect } from "react";
import { StudentInfo } from "@/app/api/student-info/route";
import { Grievance } from "@/app/admin/api/new-lodged-grievances/route";
import { AcademicInfo } from "@/app/api/academic-info/route";

const page = () => {
  //fetch all the grievances with status 'New' from the API
  const fetchGrievances = async (): Promise<Grievance[]> => {
    const res = await fetch("/api/new-lodged-grievances");
    const data = await res.json();
    return Array.isArray(data) ? data : data.grievances || [];
  };

  //now each grievance has a roll_no, i need to fetch the student info on the basis of roll_no
  const fetchStudentInfo = async (
    roll_no: string
  ): Promise<StudentInfo | null> => {
    const res = await fetch(`/api/student-info?roll_no=${roll_no}`);
    if (!res.ok) {
      console.error(`Failed to fetch student info for roll_no: ${roll_no}`);
      return null;
    }
    const data = await res.json();
    return data as StudentInfo;
  };

  //fetch academic info for each student based on roll_no
  const fetchAcademicInfo = async (
    roll_no: string
  ): Promise<AcademicInfo | null> => {
    const res = await fetch(`/api/academic-info?roll_no=${roll_no}`);
    if (!res.ok) {
      console.error(`Failed to fetch academic info for roll_no: ${roll_no}`);
      return null;
    }
    const data = await res.json();
    return data as AcademicInfo;
  };

  //use useEffect to fetch grievances on component mount
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  useEffect(() => {
    const loadGrievances = async () => {
      try {
        const fetchedGrievances = await fetchGrievances();
        setGrievances(fetchedGrievances);
      } catch (error) {
        console.error("Error fetching grievances:", error);
      }
    };
    loadGrievances();
  }, []);  

  return <div>
    <h1 className="text-2xl font-bold mb-4">New Grievances</h1>
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th className="border px-4 py-2">Roll No</th>
          <th className="border px-4 py-2">Issue ID</th>
          <th className="border px-4 py-2">Subject</th>
          <th className="border px-4 py-2">Description</th>
          <th className="border px-4 py-2">Issue Type</th>
          <th className="border px-4 py-2">Status</th>
          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">Time</th>
          <th className="border px-4 py-2">Attachment</th>
        </tr>
      </thead>
      <tbody>
        {grievances.map((grievance) => (
          <tr key={grievance.issueId}>
            <td className="border px-4 py-2">{grievance.roll_no}</td>
            <td className="border px-4 py-2">{grievance.issueId}</td>
            <td className="border px-4 py-2">{grievance.subject}</td>
            <td className="border px-4 py-2">{grievance.description}</td>
            <td className="border px-4 py-2">{grievance.issueType}</td>
            <td className="border px-4 py-2">{grievance.status}</td>
            <td className="border px-4 py-2">
              {new Date(grievance.date).toLocaleDateString()}
            </td>
            <td className="border px-4 py-2">
              {new Date(grievance.time).toLocaleTimeString()}
            </td>
            <td className="border px-4 py-2">
              {grievance.attachment ? "Yes" : "No"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>;
};

export default page;
