
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/src/types/post';
import { getAllPosts } from '@/src/lib/api/posts';
import PostCard from '@/src/components/PostCards';
import { CONFIG, MOCK_POSTS } from '@/src/config/mockData';

export default function DashboardPage() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        // Use placeholder data if enabled
        if (CONFIG.USE_PLACEHOLDER_DATA) {
          setRecentPosts(MOCK_POSTS.slice(0, 3));
          setLoading(false);
          return;
        }

        const posts = await getAllPosts();
        // Get the 3 most recent posts
        setRecentPosts(posts.slice(0, 3));
      } catch (err) {
        console.error('Error fetching posts:', err);
        // Fallback to placeholder data on error
        if (CONFIG.USE_PLACEHOLDER_DATA) {
          setRecentPosts(MOCK_POSTS.slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecentPosts();
  }, []);

  const handleViewDetails = (post: Post) => {
    router.push(`/browse/post/${post.id}`);
  };

  const handleMessage = (post: Post) => {
    router.push(`/dashboard/message?userId=${post.Owner.id}`);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Recent Posts */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Posts</h2>
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onViewDetails={handleViewDetails}
                onMessage={handleMessage}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent posts found.</p>
        )}
      </div>
    </div>
  );
}