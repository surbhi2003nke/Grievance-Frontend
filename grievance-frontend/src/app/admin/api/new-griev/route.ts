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

const Grievances = [
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
  {
    studentName: "Rahul Mehta",
    rollNo: "2022ME1033",
    issueId: "GRV-003",
    programid: 10029, // B.Tech Mechanical Engineering
    campusid: 1027, // Tech Park Campus
    subject: "Lab Equipment",
    description:
      "Several instruments in the mechanical lab are broken or outdated. Requesting replacement.",
    attachment: "/attachments/grv-003.pdf",
  },
];

export async function GET() {
  return NextResponse.json({ grievances: Grievances });
}
// This file defines an API route that returns a list of new grievances.

// get and post methods are used to handle requests.
// The GET method returns a JSON response containing the list of grievances.
