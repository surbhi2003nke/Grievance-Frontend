import { NextResponse } from "next/server";

export type AcademicInfo = {
  roll_no: string;
  programid: number;
  academicyear: number;
  term: number;
  campusid: number;
  batch: number;
  status: string;
};

const academicData: AcademicInfo[] = [
  {
    roll_no: "22041520",
    programid: 10028,
    academicyear: 2024,
    term: 1,
    campusid: 1025,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041521",
    programid: 10028,
    academicyear: 2024,
    term: 1,
    campusid: 1021,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041522",
    programid: 10029,
    academicyear: 2024,
    term: 1,
    campusid: 1021,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041523",
    programid: 10028,
    academicyear: 2024,
    term: 1,
    campusid: 1021,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041524",
    programid: 10030,
    academicyear: 2024,
    term: 1,
    campusid: 1023,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041525",
    programid: 10030,
    academicyear: 2024,
    term: 1,
    campusid: 1023,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041526",
    programid: 10032,
    academicyear: 2024,
    term: 1,
    campusid: 1024,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041527",
    programid: 10031,
    academicyear: 2024,
    term: 1,
    campusid: 1021,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041528",
    programid: 10031,
    academicyear: 2024,
    term: 1,
    campusid: 1023,
    batch: 2024,
    status: "ACTIVE",
  },
  {
    roll_no: "22041529",
    programid: 10030,
    academicyear: 2024,
    term: 1,
    campusid: 1022,
    batch: 2024,
    status: "ACTIVE",
  },
];

export async function GET() {
  return NextResponse.json({ academicData });
}

export async function POST(request: Request) {
  try {
    const academicInfo: AcademicInfo = await request.json();

    if (!academicInfo.roll_no || !academicInfo.programid) {
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
    console.error("Error processing POST /api/academic-info:", error);
    return NextResponse.json(
      { error: "Failed to process the request.", details: (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}