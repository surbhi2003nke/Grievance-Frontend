'use client';

import React, { useEffect, useState } from 'react';
import { StudentInfo } from '@/app/api/student-info/route';
import { Grievance } from '@/app/api/lodged/route';
import { AcademicInfo } from '@/app/api/academic-info/route';

//create function to fetch grievances, students, and academic info


// Row type for table
type GrievanceRow = {
  grievance: Grievance;
  student: StudentInfo | null;
  academic: AcademicInfo | null;
};

// Fetch all grievances from API
const fetchGrievances = async (): Promise<Grievance[]> => {
  const res = await fetch('/api/lodged');
  const data = await res.json();
  // If your API returns { grievances: [...] }, adjust accordingly
  return Array.isArray(data) ? data : data.grievances ?? [];
};

// Fetch all students from API
const fetchStudents = async (): Promise<StudentInfo[]> => {
  const res = await fetch('/api/student-info');
  const data = await res.json();
  return Array.isArray(data) ? data : data.students || [];
};

// Fetch all academic info from API
const fetchAcademicInfos = async (): Promise<AcademicInfo[]> => {
  const res = await fetch('/api/academic-info');
  const data = await res.json();
  return Array.isArray(data) ? data : data.academicData || [];
};

const Page = () => {
  const [rows, setRows] = useState<GrievanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [grievances, students, academics] = await Promise.all([
          fetchGrievances(),
          fetchStudents(),
          fetchAcademicInfos(),
        ]);

        // Only grievances with status exactly 'New' (case-insensitive)
        const newGrievances = grievances.filter(
          g => typeof g.status === 'string' && g.status.trim().toLowerCase() === 'new'
        );

        // Map each grievance to its student and academic info
        const rowsData: GrievanceRow[] = newGrievances.map(grievance => {
          const student = students.find(s => s.roll_no === grievance.roll_no) || null;
          const academic = academics.find(a => a.roll_no === grievance.roll_no) || null;
          return { grievance, student, academic };
        });

        setRows(rowsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (rows.length === 0) {
    return <div>No new grievances found.</div>;
  }

  return (
    <div>
      <h2>New Grievances</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Issue ID</th>
            <th>Roll No</th>
            <th>Student Name</th>
            <th>Subject</th>
            <th>Issue Type</th>
            <th>Date</th>
            <th>Program ID</th>
            <th>Campus ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ grievance, student, academic }) => (
            <tr key={grievance.issueId}>
              <td>{grievance.issueId}</td>
              <td>{grievance.roll_no}</td>
              <td>{student?.name ?? '-'}</td>
              <td>{grievance.subject}</td>
              <td>{grievance.issueType}</td>
              <td>
                {grievance.date
                  ? new Date(grievance.date).toLocaleDateString()
                  : '-'}
              </td>
              <td>{academic?.programid ?? '-'}</td>
              <td>{academic?.campusid ?? '-'}</td>
              <td>{grievance.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;