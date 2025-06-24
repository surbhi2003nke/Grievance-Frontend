"use client";
import React, { useEffect, useState } from 'react';
import { getAllAdmins } from '../../services/auth.service';
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
    <div className="min-h-screen py-8 px-0 flex items-start justify-center px-5">
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
        {/* Card Layout for Admins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-center">
          {paginatedAdmins.length === 0 ? (
            <div className="col-span-full text-center py-12 text-blue-200 text-lg bg-blue-50 rounded-xl shadow-inner w-full max-w-2xl">
              No admins found.
            </div>
          ) : (
            paginatedAdmins.map((admin, idx) => (
              <div
                key={admin.adminid || idx}
                className="w-full flex flex-row items-center justify-between p-5 bg-white/90 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 min-h-[90px] max-w-2xl mx-auto"
                style={{ minWidth: 320 }}
              >
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{admin.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 text-base truncate">{admin.name}</div>
                      <div className="text-xs text-blue-400 truncate">{admin.email}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-medium border border-blue-100">{admin.role}</span>
                    <span className="bg-yellow-50 text-yellow-800 rounded px-2 py-0.5 text-xs font-medium border border-yellow-100">{admin.campusname} <span className="text-xs text-blue-300">({admin.campuscode})</span></span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-6 min-w-[90px]">
                  {admin.isactive ? (
                    <span className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold w-full text-center">Active</span>
                  ) : (
                    <span className="px-3 py-1 rounded bg-blue-50 text-blue-300 text-xs font-semibold w-full text-center">Inactive</span>
                  )}
                  <button
                    onClick={() => handleDelete(admin.adminid)}
                    disabled={deletingId === admin.adminid}
                    className="px-3 py-1 rounded bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium transition w-full"
                  >
                    {deletingId === admin.adminid ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
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