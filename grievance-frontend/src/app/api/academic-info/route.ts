import { NextResponse } from "next/server";

type AcademicInfo = {
  id: number;
  rollno: string;
  programid: string;
  academicyear: number;
  term: number;
  campusid: number;
  batch: number;
  status: string;
};

const academicData: AcademicInfo[] = [
  {
    id: 1,
    rollno: "22041520",
    programid: "10028",
    academicyear: 2024,
    term: 1,
    campusid: 1026,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 2,
    rollno: "22041521",
    programid: "10028",
    academicyear: 2024,
    term: 1,
    campusid: 1026,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 3,
    rollno: "22041522",
    programid: "10017",
    academicyear: 2024,
    term: 1,
    campusid: 1020,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 4,
    rollno: "22041523",
    programid: "10028",
    academicyear: 2024,
    term: 1,
    campusid: 1011,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 5,
    rollno: "22041524",
    programid: "10036",
    academicyear: 2024,
    term: 1,
    campusid: 1016,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 6,
    rollno: "22041525",
    programid: "10036",
    academicyear: 2024,
    term: 1,
    campusid: 1016,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 7,
    rollno: "22041526",
    programid: "10036",
    academicyear: 2024,
    term: 1,
    campusid: 1016,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 8,
    rollno: "22041527",
    programid: "10031",
    academicyear: 2024,
    term: 1,
    campusid: 1011,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 9,
    rollno: "22041528",
    programid: "10036",
    academicyear: 2024,
    term: 1,
    campusid: 1023,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    id: 10,
    rollno: "22041529",
    programid: "10030",
    academicyear: 2024,
    term: 1,
    campusid: 1012,
    batch: 2024,
    status: "ACTIVE",
  },
];

export async function GET() {
  return NextResponse.json({ academicData });
}


// This file defines an API route that returns a list of academic information for students.
// The data includes fields such as roll number, program ID, academic year, term, campus ID, batch, and status.
export async function POST(request: Request) {
  try {
    const academicInfo: AcademicInfo = await request.json();

    if (!academicInfo.rollno || !academicInfo.programid) {
      return NextResponse.json(
        { error: "Roll number and program ID are required." },
        { status: 400 }
      );
    }

    // Here you would typically save the academic info to a database
    // For this example, we will just return the received data
    return NextResponse.json({
      message: "Academic information received successfully.",
      data: academicInfo,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process the request." },
      { status: 500 }
    );
  }
}