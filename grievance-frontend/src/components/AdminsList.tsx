"use client";
import React, { useEffect, useState } from 'react';
import { getAllAdmins } from '../services/auth.service';
import axios from 'axios';
import { useAuth } from "@/context/AuthContext";

type Admin = {
  adminid: string;
  name: string;
  email: string;
  role: string;
  campusid: number;
  isactive: boolean;
  createdat: string;
  updatedat: string;
  campuscode: string;
  campusname: string;
  assigned_campuses: (number | null)[];
};

const PAGE_SIZE = 8;

const AdminsList = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAllAdmins();
        setAdmins(data.data || []);
      } catch (err) {
        setError('Failed to fetch admins');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.toLowerCase()) ||
      admin.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAdmins.length / PAGE_SIZE);
  const paginatedAdmins = filteredAdmins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    // Reset to first page if search changes
    setPage(1);
  }, [search]);

  // Prompt for token (could be improved with a modal or context in a real app)
  async function handleDelete(adminid: string) {
    const confirmed = window.confirm('Are you sure you want to delete this admin?');
    if (!confirmed) return;
    if (!token) {
      setDeleteError('No authentication token found. Please log in as superadmin.');
      return;
    }
    setDeletingId(adminid);
    setDeleteError(null);
    try {
      await axios.delete(`https://grievanceportal.vercel.app/api/v1/super-admin/admins/${adminid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins((prev) => prev.filter((a) => a.adminid !== adminid));
    } catch (err: any) {
      setDeleteError('Failed to delete admin. Check your token or try again.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <div className="p-8 text-center text-blue-600">Loading admins...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-0 flex items-start justify-center">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow border border-blue-100 p-6 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-1">Admins</h2>
            <p className="text-blue-500 text-xs">All administrators</p>
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-2 py-1 rounded border border-blue-100 focus:ring-1 focus:ring-blue-200 focus:border-transparent bg-blue-50 text-blue-900 placeholder:text-blue-300 text-sm"
            style={{ minWidth: 180 }}
          />
        </div>
        {/* Responsive Table Layout */}
        <div className="overflow-x-auto rounded-xl scrollbar-hide w-full">
          <table className="w-full bg-white rounded-xl text-sm border-separate border-spacing-0">
            <thead className="bg-white border-b border-blue-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-blue-800 whitespace-nowrap">ID</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800 whitespace-nowrap">Name</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800 whitespace-nowrap">Email</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800 whitespace-nowrap">Role</th>
                <th className="px-3 py-2 text-left font-medium text-blue-800 whitespace-nowrap">Campus</th>
                <th className="px-3 py-2 text-center font-medium text-blue-800 whitespace-nowrap">Active</th>
                <th className="px-3 py-2 text-center font-medium text-blue-800 whitespace-nowrap">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdmins.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-blue-200 text-base">No admins found.</td>
                </tr>
              ) : (
                paginatedAdmins.map((admin, idx) => (
                  <tr
                    key={admin.adminid || idx}
                    className="hover:bg-blue-50 border-b border-blue-50 last:border-b-0"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-blue-700 whitespace-nowrap align-middle">{admin.adminid}</td>
                    <td className="px-3 py-2 font-medium text-blue-900 whitespace-nowrap align-middle">{admin.name}</td>
                    <td className="px-3 py-2 text-blue-700 whitespace-nowrap align-middle">{admin.email}</td>
                    <td className="px-3 py-2 capitalize text-blue-700 whitespace-nowrap align-middle">{admin.role}</td>
                    <td className="px-3 py-2 text-blue-700 whitespace-nowrap align-middle">{admin.campusname} <span className="text-xs text-blue-300">({admin.campuscode})</span></td>
                    <td className="px-3 py-2 text-center align-middle">
                      {admin.isactive ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">Active</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-300 text-xs font-semibold">Inactive</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center align-middle">
                      <button
                        onClick={() => handleDelete(admin.adminid)}
                        disabled={deletingId === admin.adminid}
                        className="px-2 py-1 rounded bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition"
                      >
                        {deletingId === admin.adminid ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition"
            >
              Prev
            </button>
            <span className="text-blue-700 text-sm font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 transition"
            >
              Next
            </button>
          </div>
        )}
        {deleteError && (
          <div className="text-center text-red-500 text-sm mt-2">{deleteError}</div>
        )}
      </div>
      <style jsx global>{`
        /* Hide scrollbars for all browsers */
        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AdminsList; 