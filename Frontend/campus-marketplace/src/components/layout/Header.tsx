// This could be a 'use client' component if it handles cart interaction state
'use client'; 
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSignedIn, signOut } from '@/src/config/mockData';

export default function Header() {

  //useState for message count could be added here in the future
  const messageCount = 5; // Placeholder for actual state
  
  //Use mock authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Set initial auth state
    setIsAuthenticated(isSignedIn());

    // Listen for auth changes
    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setIsAuthenticated(customEvent.detail.isSignedIn);
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        {isAuthenticated ? (
          <Link href="/dashboard" className="text-2xl font-bold text-gray-800">
            Campus Marketplace
          </Link>
        ) : (
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Campus Marketplace
          </Link>
        )}
        <nav className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                Browse
              </Link>
              <Link href="/dashboard/post" className="text-gray-600 hover:text-gray-900">
                Post
              </Link>
              <Link href="/dashboard/message" className="text-gray-600 hover:text-gray-900 flex items-center">
                Messages ({messageCount})
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 cursor-pointer bg-none border-none"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/browse" className="text-gray-600 hover:text-gray-900">
                Browse
              </Link>
              <Link href="/dashboard/message" className="text-gray-600 hover:text-gray-900">
                Messages
              </Link>
              <Link href="/signin" className="text-gray-600 hover:text-gray-900">
                Sign In / Sign Up
              </Link>
            </>
          )}
          
        </nav>
      </div>
    </header>
  );
}