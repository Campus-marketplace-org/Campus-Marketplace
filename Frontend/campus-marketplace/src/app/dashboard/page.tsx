
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostCardList } from '@/src/components/PostCards';
import { isSignedIn } from '@/src/config/mockData';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set initial auth state
    const authStatus = isSignedIn();
    setIsAuthenticated(authStatus);

    // Listen for auth changes
    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setIsAuthenticated(customEvent.detail.isSignedIn);
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="p-4">
        <p className="text-gray-500">You must be signed in to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard/post')}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Create New Post
            </button>
            <button
              onClick={() => router.push('/browse')}
              className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              Browse All Listings
            </button>
            <button
              onClick={() => router.push('/dashboard/message')}
              className="w-full px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              View Messages
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-blue-500">3</div>
              <div className="text-sm text-gray-600">Active Posts</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-green-500">12</div>
              <div className="text-sm text-gray-600">Messages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Listings with Infinite Scroll */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Trending Listings</h2>
        <div className="overflow-hidden pb-2">
          <PostCardList />
        </div>
      </div>
    </div>
  );
}