'use client';
import { useEffect, useState } from 'react';
import { User } from '../../../lib/types';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface UserDetailsProps {
  params: {
    userId: string;
  };
}

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export default function UserDetailsPage({ params }: UserDetailsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/${params.userId}`);
        const data: User = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [params.userId]);

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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 relative">
      <Link href="/dashboard">
        <motion.button
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-blue-600 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Users
        </motion.button>
      </Link>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-white shadow-xl rounded-2xl p-6 md:p-10 relative overflow-hidden"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          User Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
              Personal Information
            </h2>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-lg font-medium">@{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-lg font-medium">{user.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Website</p>
              <a href={`http://${user.website}`} className="text-blue-600 hover:underline text-lg font-medium">
                {user.website}
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
              Address
            </h2>
            <div>
              <p className="text-sm text-gray-500">Street</p>
              <p className="text-lg font-medium">{user.address.street}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Suite</p>
              <p className="text-lg font-medium">{user.address.suite}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="text-lg font-medium">{user.address.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Zipcode</p>
              <p className="text-lg font-medium">{user.address.zipcode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Geo Location</p>
              <p className="text-lg font-medium">{user.address.geo.lat}, {user.address.geo.lng}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t space-y-4 z-10 relative">
          <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">
            Company
          </h2>
          <div>
            <p className="text-sm text-gray-500">Company Name</p>
            <p className="text-lg font-medium">{user.company.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Catch Phrase</p>
            <p className="text-lg font-medium">{user.company.catchPhrase}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business</p>
            <p className="text-lg font-medium">{user.company.bs}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}