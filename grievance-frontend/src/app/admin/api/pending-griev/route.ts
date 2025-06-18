import { NextResponse } from "next/server";

//define type for grievance
type Grievance = {
  studentName: string;
  rollNo: string;
  issueId: string;
  programid: number; // Program ID
  campusid: number; // Campus ID
  subject: string;
  description: string;
  attachment: string | null; // URL to the attachment or null if no attachment
};

// In-memory pending grievances list (mock DB)
let pendingGrievances = [
  {
    studentName: "Neha Rajput",
    rollNo: "2021CSE1045",
    issueId: "PGRV-001",
    programid: "B.Tech CSE",
    campus: "Main Campus",
    subject: "Harassment Complaint",
    description: "Submitted a complaint regarding verbal harassment from a faculty member. Needs urgent review.",
    attachment: "/attachments/pgrv-001.pdf",
    status: "Pending",
    priority: null, // To be set by admin
  },
  {
    studentName: "Rohan Das",
    rollNo: "2020EEE1023",
    issueId: "PGRV-002",
    program: "B.Tech EEE",
    campus: "City Campus",
    subject: "Incorrect Attendance Marking",
    description: "Attendance records are not reflecting despite presence. This is affecting exam eligibility.",
    attachment: null,
    status: "Pending",
    priority: null,
  },
];

export async function GET() {
  return NextResponse.json({ grievances: pendingGrievances });
}
