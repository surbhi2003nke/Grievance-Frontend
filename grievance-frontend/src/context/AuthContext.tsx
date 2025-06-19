"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentInfo } from '@/app/api/student-info/route';
import { AdminInfo } from '@/app/api/admin-info/route';

type User = AdminInfo | StudentInfo;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAdmin: false,
  isStudent: false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First get authentication status and user type
        const authResponse = await fetch('/api/auth');
        if (!authResponse.ok) {
          throw new Error('Failed to authenticate');
        }
        
        const { isAuthenticated, userType, userId } = await authResponse.json();

        if (!isAuthenticated) {
          setUser(null);
          return;
        }

        if (userType === 'admin') {
          // Fetch admin details and find specific admin
          const adminResponse = await fetch('/api/admin-info');
          if (adminResponse.ok) {
            const { admins } = await adminResponse.json();
            const adminData = admins.find((admin: AdminInfo) => admin.AdminId === Number(userId));
            if (adminData) {
              setUser(adminData);
            } else {
              setError('Admin not found');
            }
          }
        } else if (userType === 'student') {
          // Fetch student details and find specific student
          const studentResponse = await fetch('/api/student-info');
          if (studentResponse.ok) {
            const students = await studentResponse.json(); // Remove the { students } destructuring
            console.log('Students data:', students); // Debug log
            console.log('Looking for student with roll_no:', userId); // Debug log
            
            const studentData = students.find((student: StudentInfo) => student.roll_no === userId);
            console.log('Found student:', studentData); // Debug log
            
            if (studentData) {
              setUser(studentData);
            } else {
              setError('Student not found');
            }
          } else {
            setError('Failed to fetch student data');
          }
        }
      } catch (err) {
        console.error('Error in fetchUser:', err); // Debug log
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Helper functions to check user type
  const isAdmin = (user: User): user is AdminInfo => {
    return 'AdminId' in user;
  };

  const isStudent = (user: User): user is StudentInfo => {
    return 'roll_no' in user;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error,
        isAdmin: user ? isAdmin(user) : false,
        isStudent: user ? isStudent(user) : false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
