import { NextResponse } from "next/server";

//define type for grievance
type Grievance = {
  Name: string;
  roll_no: string;
  issueId: string;
  programid: number;
  campusid: number;
  subject: 'Pending' | 'Resolved' |'Rejected' | 'New';
  description: string;
  issueType: 'Academic' | 'Non-Academic' | 'Examination';
  status: string;
  date: string;
  time: string;
  attachment: boolean;
};

const grievances: Grievance[] = [
  {
    Name: "Akhil Singh",
    roll_no: "22041520",
    issueId: "G2024-0001",
    programid: 10028,
    campusid: 1021,
    subject: "Pending",
    description: "The assignment submitted on 15th March has not been evaluated yet.",
    issueType: "Academic",
    status: "Pending",
    date: "2024-03-20",
    time: "10:00 AM",
    attachment: false,
  },
  {
    Name: "Amaan Khan",
    roll_no: "22041521",
    issueId: "G2024-0002",
    programid: 10028,
    campusid: 1021,
    subject: "Resolved",
    description: "The book 'Data Structures' is not available in the library.",
    issueType: "Examination",
    status: "Resolved",
    date: "2024-03-21",
    time: "11:00 AM",
    attachment: true,
  }
];


export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // This will be replaced with database query later
    // const grievances = await db.query('SELECT * FROM grievances ORDER BY date DESC');
    
    return NextResponse.json(grievances);
  } catch (error) {
    console.error('Error fetching grievance history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grievance history' },
      { status: 500 }
    );
  }
}
