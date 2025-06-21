"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, loading, error, userType, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[40vh]">
        <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span className="text-lg text-gray-700">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!token) {
    // The redirect will happen in useEffect, so just render nothing here
    return null;
  }

  let welcomeName = "";
  if (user) {
    if (userType === "admin" && "name" in user) welcomeName = String(user.name);
    if (userType === "student" && "name" in user) welcomeName = String(user.name);
  }

  return (
    <div>
      {welcomeName && (
        <div className="p-8 pb-0">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {welcomeName}!</h1>
        </div>
      )}
      {userType === "admin" && <AdminDashboard />}
      {userType === "student" && <StudentDashboard />}
      {!userType && (
        <div className="p-8 text-gray-600">
          No dashboard available for your role.<br />
          <a href="/logout" className="text-blue-600 underline">Login with a different account</a>
        </div>
      )}
    </div>
  );
}
