'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post } from '@/src/types/post';
import { CONFIG, MOCK_POSTS, isSignedIn } from '@/src/config/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        // Use placeholder data if enabled
        if (CONFIG.USE_PLACEHOLDER_DATA) {
          const mockPost = MOCK_POSTS.find(p => p.id === parseInt(postId));
          if (mockPost) {
            setPost(mockPost);
          } else {
            setNotFound(true);
          }
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    }

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading post...</p>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h1>
            <p className="text-gray-600 mb-6">
              The post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-800 mb-2">Error</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/browse')}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Back to Browse
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 text-blue-500 hover:text-blue-700 transition flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Image */}
          <div className="mb-6">
            <div
              className="w-full h-96 rounded-lg shadow-md bg-cover bg-center"
              style={{
                backgroundImage: `url(${post.imageUrl})`,
              }}
              role="img"
              aria-label={post.title}
            />
          </div>

          {/* Title and Price */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-4xl font-bold text-green-600 mb-4">
              ${post.askingPrice.toFixed(2)}
            </p>
            <div className="flex gap-4 mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {post.category}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{post.description}</p>
          </div>

          {/* Seller Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Seller Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-800">
                <strong>Username:</strong> {post.Owner?.username || 'Unknown'}
              </p>
              <p className="text-gray-800">
                <strong>Email:</strong> {post.Owner?.email || 'Not available'}
              </p>
              <p className="text-gray-800">
                <strong>College:</strong> {post.Owner?.college || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="sticky top-4 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            <button
              onClick={() => {
                if (isSignedIn()) {
                  router.push(`/dashboard/message?userId=${post.Owner.id}`);
                } else {
                  alert('Sign in to message sellers');
                }
              }}
              className="w-full mb-3 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition font-semibold"
            >
              Send Message
            </button>
            <button
              className="w-full px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition font-semibold"
            >
              Report Item
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Post ID:</strong> {post.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
