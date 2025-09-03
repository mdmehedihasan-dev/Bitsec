'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User } from '../../lib/types';
import { useDebounce } from '../../hooks/useDebounce';
import { AnimatedCard } from '../../components/AnimatedCard';

const USERS_PER_PAGE = 5; // ✅ show 5 per page
const API_URL = 'https://jsonplaceholder.typicode.com/users';

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch(API_URL);
        const data: User[] = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!debouncedSearchTerm) {
      return users;
    }
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [users, debouncedSearchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-5xl font-bold text-center my-6 text-gray-800"
      >
        User Management
      </motion.h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // ✅ reset page on search
          }}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-slide-up">
        <div className="hidden md:grid grid-cols-5 p-4 bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
          <div className="col-span-1">Name</div>
          <div className="col-span-1">Email</div>
          <div className="col-span-1">Phone</div>
          <div className="col-span-2">Company</div>
        </div>
        <div className="divide-y divide-gray-200">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, index) => (
              <Link key={user.id} href={`/dashboard/${user.id}`}>
                <AnimatedCard
                  className="grid grid-cols-1 md:grid-cols-5 p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  delay={index * 0.1}
                >
                  <div className="font-medium text-gray-900 truncate">{user.name}</div>
                  <div className="text-gray-600 truncate">{user.email}</div>
                  <div className="text-gray-600 truncate">{user.phone}</div>
                  <div className="text-gray-600 col-span-2 truncate">{user.company.name}</div>
                </AnimatedCard>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">No users found.</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {/* Prev button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Prev
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
