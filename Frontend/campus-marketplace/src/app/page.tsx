'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostCardList } from '@/src/components/PostCards';
import { isSignedIn, signIn } from '@/src/config/mockData';

export default function Home() {
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

  const handleSignIn = () => {
    signIn();
    setIsAuthenticated(true);
    // Redirect to dashboard after signing in
    router.push('/dashboard');
  };

  return (
    <div className="px-6 py-6 font-sans text-gray-900">
      <header className="flex justify-between items-center mb-4">
        <p className="m-0 mt-1.5 text-gray-500">Browse items posted by other students — no account required to view listings.</p>
      </header>

      <section aria-label="Listings" className="mb-5">
        <h2 className="text-lg m-0 mb-2">Trending listings</h2>
        <div className="overflow-hidden pb-2">
          <PostCardList />
        </div>
      </section>

      <footer className="mt-3 pt-3 border-t border-gray-200 text-gray-500 text-sm">
        <p className="m-0 mb-2">
          {isAuthenticated 
            ? 'You are signed in. Browse items, save favorites, and message sellers.'
            : 'You are viewing as a guest. Create an account to post items, save favorites, and message sellers.'}
        </p>
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <>
              <button
                onClick={handleSignIn}
                className="bg-blue-600 text-white border-none px-3 py-2 rounded cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => window.location.href = '/browse'}
                className="bg-transparent border border-gray-300 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Browse more
              </button>
            </>
          ) : (
            <button
              onClick={() => window.location.href = '/browse'}
              className="bg-transparent border border-gray-300 px-3 py-2 rounded cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Browse more
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
