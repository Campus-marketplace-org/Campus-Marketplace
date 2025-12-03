'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from './PostCards.module.css';
import scrollStyles from './InfiniteScroll.module.css';

// Type definitions based on backend Post entity
import { Post } from '@/src/types/post';
import { CONFIG, MOCK_POSTS, isSignedIn } from '@/src/config/mockData';

export interface PostCardProps {
  post: Post;
  onViewDetails?: (post: Post) => void;
  onMessage?: (post: Post) => void;
}

export default function PostCard({ post, onViewDetails, onMessage }: PostCardProps) {
  return (
    <article
      className="flex-none w-[300px] bg-white rounded-lg shadow-md p-3 border border-gray-100"
      role="listitem"
    >
      <div
        className={`rounded-lg bg-cover bg-center mb-3 ${styles.cardImage}`}
        style={{
          backgroundImage: `url(${post.imageUrl})`,
        }}
        role="img"
        aria-label={post.title}
      />
      <h3 className="text-lg font-semibold mb-1.5">{post.title}</h3>
      <div className="flex justify-between items-center mb-2">
        <strong className="text-green-600">${post.askingPrice.toFixed(2)}</strong>
        <span className="text-sm text-gray-600">{post.category}</span>
      </div>
      <p
        title={post.description}
        className="text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap mb-3"
      >
        {post.description}
      </p>
      <div className="text-xs text-gray-500 mb-3">
        Posted by: {post.Owner?.username || "Unknown"}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails?.(post)}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          View details
        </button>
        <button
          onClick={() => onMessage?.(post)}
          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Message
        </button>
      </div>
    </article>
  );
}

export function PostCardList() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Use placeholder data if enabled, otherwise fetch from API
        if (CONFIG.USE_PLACEHOLDER_DATA) {
          setPosts(MOCK_POSTS);
          setLoading(false);
          return;
        }

        // Fetch first 5 posts from API
        const postsPromises = Array.from({ length: 5 }, (_, i) => 
          fetch(`http://localhost:8080/api/posts/${i + 1}`)
            .then(res => res.ok ? res.json() : null)
        );

        const results = await Promise.all(postsPromises);
        const validPosts = results.filter((post): post is Post => post !== null);
        
        setPosts(validPosts);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const handleViewDetails = (post: Post) => {
    router.push(`/browse/post/${post.id}`);
  };

  const handleMessage = () => {
    if (isSignedIn()) {
      alert('Message seller functionality coming soon');
    } else {
      alert('Sign in to message sellers');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-center py-4">No posts available.</div>;
  }

  return (
    <div className={scrollStyles.scrollViewport}>
      <div className={scrollStyles.scrollTrack}>
        {[...posts, ...posts].map((post, idx) => (
          <PostCard
            key={`${post.id}-${idx}`}
            post={post}
            onViewDetails={handleViewDetails}
            onMessage={handleMessage}
          />
        ))}
      </div>
    </div>
  );
}