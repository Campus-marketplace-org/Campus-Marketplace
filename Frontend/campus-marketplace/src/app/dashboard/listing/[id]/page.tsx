'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/src/types/post';
import { getPostById } from '@/src/lib/api/posts';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CONFIG, MOCK_POSTS } from '@/src/config/mockData';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPost() {
      try {
        // Use placeholder data if enabled
        if (CONFIG.USE_PLACEHOLDER_DATA) {
          const mockPost = MOCK_POSTS.find(p => p.id === parseInt(params.id));
          if (mockPost) {
            setPost(mockPost);
          } else {
            setError('Post not found');
          }
          setLoading(false);
          return;
        }

        const postData = await getPostById(parseInt(params.id));
        setPost(postData);
      } catch (err) {
        setError('Failed to load post details');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error || !post) {
    return <div className="p-4 text-red-500">{error || 'Post not found'}</div>;
  }

  const handleMessage = () => {
    router.push(`/dashboard/message?userId=${post.Owner.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image */}
        <div className="relative h-96">
          <Image
            src={post.imageUrl || 'https://via.placeholder.com/800x600?text=No+Image'}
            alt={post.title}
            className="w-full h-full object-cover"
            width={800}
            height={600}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
              <p className="text-3xl font-bold text-green-600">
                ${post.askingPrice.toFixed(2)}
              </p>
            </div>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded">
              {post.category}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{post.description}</p>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Seller Information</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Posted by: {post.Owner.username}</p>
                <p className="text-gray-600">{post.Owner.college}</p>
              </div>
              <button
                onClick={handleMessage}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Message Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}