'use client';

import React, { useEffect, useState } from 'react';
import { PostCardList } from '@/src/components/PostCards';
import { isSignedIn, signIn } from '@/src/config/mockData';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif', color: '#111' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <p style={{ margin: '6px 0 0', color: '#555' }}>Browse items posted by other students — no account required to view listings.</p>
      </header>

      <section aria-label="Listings" style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 18, margin: '0 0 8px' }}>Trending listings</h2>
      <div style={{ overflow: 'hidden', paddingBottom: 8 }}>
        <style>{`
          /* adjustable speed (seconds) */
          :root { --scroll-duration: 36s; }

          .auto-scroll-viewport { overflow: hidden; }
          .auto-scroll-track {
        display: inline-flex;           /* keep items in one row */
        gap: 12px;
        align-items: flex-start;
        width: max-content;             /* shrink to content so translateX(-50%) is correct */
        will-change: transform;
        animation: scroll var(--scroll-duration) linear infinite;
          }

          /* Pause when user hovers or focuses (accessibility) */
          .auto-scroll-viewport:hover .auto-scroll-track,
          .auto-scroll-viewport:focus-within .auto-scroll-track {
        animation-play-state: paused;
          }

          /* seamless loop moves exactly half (the duplicated set) */
          @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
          }

          /* hide scrollbar if any */
          .auto-scroll-track::-webkit-scrollbar { display: none; }

          /* respect reduced motion preference */
          @media (prefers-reduced-motion: reduce) {
        .auto-scroll-track { animation: none; }
          }
        `}</style>

        <PostCardList />
      </div>
      </section>

      <footer style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f2f2f2', color: '#666', fontSize: 14 }}>
      <p style={{ margin: '0 0 8px' }}>
        {isAuthenticated 
          ? 'You are signed in. Browse items, save favorites, and message sellers.'
          : 'You are viewing as a guest. Create an account to post items, save favorites, and message sellers.'}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        {!isAuthenticated ? (
          <>
            <button
              onClick={handleSignIn}
              style={{ background: '#0b67ff', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
            >
              Sign In
            </button>
            <button
              onClick={() => window.location.href = '/browse'}
              style={{ background: 'transparent', border: '1px solid #d0d0d0', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
            >
              Browse more
            </button>
          </>
        ) : (
          <button
            onClick={() => window.location.href = '/browse'}
            style={{ background: 'transparent', border: '1px solid #d0d0d0', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
          >
            Browse more
          </button>
        )}
      </div>
      </footer>
    </div>
  );
}
