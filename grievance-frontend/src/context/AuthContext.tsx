"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentInfo } from '@/app/api/student-info/route';
import { AdminInfo } from '@/app/api/admin-info/route';

type User = AdminInfo | StudentInfo;

// Updated type to match the actual API response structure
export type LoginResponse = {
  success?: boolean;
  token: string;
  user: {
    rollNumber?: string;
    rollno?: string;
    name: string;
    email: string;
    AdminId?: number;
    // Add other fields that might come from the API
    [key: string]: any;
  };
  message?: string;
};

interface AuthContextType {
  user: StudentInfo | AdminInfo | null;
  token: string | null;
  userType: 'student' | 'admin' | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginResponse, userType: 'student' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  userType: null,
  loading: true,
  error: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize from localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    if (storedToken && storedUser && storedUserType) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      console.log("User state initialized from localStorage:", parsedUser); // CONSOLE LOG ADDED
      // Type assertion based on userType
      if (storedUserType === 'student') {
        setUser(parsedUser as StudentInfo);
      } else if (storedUserType === 'admin') {
        setUser(parsedUser as AdminInfo);
      }
      setUserType(storedUserType as 'student' | 'admin');
    }
    setLoading(false);
  }, []);

  const login = (data: LoginResponse, userType: 'student' | 'admin') => {
    setToken(data.token);
    
    // Transform the API response to match our expected user types
    if (userType === 'student') {
      // Map API response to StudentInfo structure
      const studentUser: StudentInfo = {
        rollno: data.user.rollno || data.user.rollNumber || '', // Handle both field names
        name: data.user.name,
        father: data.user.father || '',
        mother: data.user.mother || '',
        aadhar: data.user.aadhar || '',
        category: data.user.category || '',
        gender: data.user.gender || '',
        lateral_entry: data.user.lateral_entry || false,
        email: data.user.email,
        mobile: data.user.mobile || '',
        year: data.user.year || new Date().getFullYear(),
      };
      setUser(studentUser);
      console.log("User state updated after student login:", studentUser); // CONSOLE LOG ADDED
      localStorage.setItem('user', JSON.stringify(studentUser));
    } else if (userType === 'admin') {
      // Map API response to AdminInfo structure
      const adminUser: AdminInfo = {
        AdminId: data.user.AdminId || 0,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || data.user.mobile || '',
        isverified: data.user.isverified || false,
        IsActive: data.user.IsActive || true,
        LastLogin: data.user.LastLogin || new Date().toISOString(),
        createdAt: data.user.createdAt || new Date().toISOString(),
        updatedAt: data.user.updatedAt || new Date().toISOString(),
        role: data.user.role || [],
        permissions: data.user.permissions || [],
      };
      setUser(adminUser);
      console.log("User state updated after admin login:", adminUser); // CONSOLE LOG ADDED
      localStorage.setItem('user', JSON.stringify(adminUser));
    }
    
    setUserType(userType);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userType', userType);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        userType,
        loading, 
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
