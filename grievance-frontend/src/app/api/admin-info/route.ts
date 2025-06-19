import { NextResponse } from "next/server";

export type AdminInfo = {
  AdminId: number;
  name: string;
  email: string;
  phone: string;
  isverified: boolean;
  IsActive: boolean;
  LastLogin: string;
  createdAt: string;
  updatedAt: string;
  role: string[];
  permissions: string[];
};

const admins: AdminInfo[] = [
  {
    AdminId: 1,
    name: "Amit",
    email: "admin@example.com",
    phone: "1234567890",
    isverified: true,
    IsActive: true,
    LastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    role: ["Super Admin"],
    permissions: ["read", "write", "delete"]
  },
  {
    AdminId: 2,
    name: "Sumit",
    email: "superadmin@example.com",
    phone: "9876543210",
    isverified: true,
    IsActive: true,
    LastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    role: ["Campus Admin"],
    permissions: ["read", "write"]
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ admins });
  } catch (error) {
    console.error('Error fetching admin info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin information' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminInfo: AdminInfo = await request.json();

    if (!adminInfo.name || !adminInfo.email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    // Here you would typically save the admin info to a database
    // For this example, we will just return the received data
    return NextResponse.json({
      message: "Admin information received successfully.",
      adminInfo,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON or request body." },
      { status: 400 }
    );
  }
}
