import { NextResponse } from "next/server";
// Define type for grievance
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

// In-memory completed grievances list (mock DB)
let completedGrievances: Grievance[] = [
  {
    studentName: "Aarav Sharma",
    rollNo: "2023CSE1001",
    issueId: "GRV-001",
    programid: 10028, // B.Tech Computer Science
    campusid: 1026, // Main Campus
    subject: "Wi-Fi Issues",
    description:
      "The Wi-Fi in Block C has been unstable for the last two weeks, affecting online submissions.",
    attachment: "/attachments/grv-001.pdf", // simulate URL to PDF
  },
  {
    studentName: "Isha Verma",
    rollNo: "2023ECE1012",
    issueId: "GRV-002",
    programid: 10017, // B.Sc Mathematics
    campusid: 1020, // City Campus
    subject: "Cafeteria Cleanliness",
    description:
      "The hygiene in the campus cafeteria has deteriorated. Unclean tables and poor waste disposal.",
    attachment: null,
  },
];

export async function GET() {
  return NextResponse.json({ grievances: completedGrievances });
}
// This file defines an API route that returns a list of completed grievances.
// The GET method returns a JSON response containing the list of grievances.
