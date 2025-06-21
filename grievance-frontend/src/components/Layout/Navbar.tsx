"use client";
import React from "react";
import Image from "next/image";
import { CircleUserRound, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { StudentInfo } from '@/app/api/student-info/route';

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className = "" }: NavbarProps) => {
  const { user, loading, userType } = useAuth();

  const getUserDisplay = () => {
    if (loading) {
      return "Loading...";
    }
    if (!user) {
      return "Not logged in";
    }
    
    if (userType === 'admin') {
      return `Admin: ${user.name}`;
    }
    
    if (userType === 'student') {
      const student = user as StudentInfo; // Type assertion for student
      return `${student.name} (${student.rollno})`;
    }
    
    return "Unknown user";
  };

  return (
    <div className={`w-full bg-white border-b border-blue-100 p-2 flex justify-between items-center ${className}`}>
      <Image 
        src="https://dseu.ac.in/assets/DSEULOGOTHICK-Bm0-gkb8.svg" 
        width={40} 
        height={40} 
        alt="logo" 
        className='cursor-pointer ml-2 mt-2'
      />
      
      {/* Styled Right Side */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-2 shadow-sm border border-blue-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <CircleUserRound className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {getUserDisplay()}
            </span>
            <span className="text-xs text-gray-500">
              {userType === 'admin' ? 'Administrator' : userType === 'student' ? 'Student' : 'Guest'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
