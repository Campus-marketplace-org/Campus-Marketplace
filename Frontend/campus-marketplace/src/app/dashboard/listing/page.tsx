'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/src/types/post';
import PostCard from '@/src/components/PostCards';
import { getAllPosts } from '@/src/lib/api/posts';
import { CONFIG, MOCK_POSTS } from '@/src/config/mockData';

export default function ListingPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Use placeholder data if enabled
        if (CONFIG.USE_PLACEHOLDER_DATA) {
          setPosts(MOCK_POSTS);
          setLoading(false);
          return;
        }

        const postsData = await getAllPosts();
        setPosts(postsData);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error fetching posts:', err);
        // Fallback to placeholder data on error
        if (CONFIG.USE_PLACEHOLDER_DATA) {
          setPosts(MOCK_POSTS);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(posts.map(post => post.category))];

  const handleViewDetails = (post: Post) => {
    router.push(`/dashboard/listing/${post.id}`);
  };

  const handleMessage = (post: Post) => {
    router.push(`/dashboard/message?userId=${post.Owner.id}`);
  };

  if (loading) {
    return <div className="p-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search listings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl p-2 border rounded"
        />
        <div className="mt-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onViewDetails={handleViewDetails}
              onMessage={handleMessage}
            />
          ))}
        </div>
      )}
    </div>
  );
}