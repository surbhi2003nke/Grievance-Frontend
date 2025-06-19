import { NextResponse } from "next/server";

// Mock auth data - This will be replaced with real authentication later
const mockAuthData = {
  isAuthenticated: true,
  userType: "student", // or "admin"
  userId: "22041528"   // roll number for student, adminId for admin
};

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This will be replaced with actual session/token validation
    return NextResponse.json(mockAuthData);
  } catch (error) {
    console.error('Error in auth:', error);
    return NextResponse.json(
      { 
        isAuthenticated: false,
        error: 'Failed to authenticate user' 
      },
      { status: 500 }
    );
  }
}
