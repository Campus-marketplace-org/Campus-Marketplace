'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '@/src/types/message';
import { getMessagesBetweenUsers, sendMessage, checkUserExists } from '@/src/lib/api/messages';
import { getUser } from '@/src/lib/api/auth';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="mb-1">{message.content}</p>
        <div className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default function MessagePage() {
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [conversationPartners, setConversationPartners] = useState<string[]>([]);
  const [guestUsername, setGuestUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get current user on mount (optional - can use guest mode)
  useEffect(() => {
    const user = getUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    const activeUsername = currentUser?.username || guestUsername;
    if (!selectedUser || !activeUsername) return;

    setLoading(true);
    setError(null);
    try {
      const msgs = await getMessagesBetweenUsers(activeUsername, selectedUser);
      setMessages(msgs);

      // Update conversation partners list
      if (!conversationPartners.includes(selectedUser)) {
        setConversationPartners(prev => [...prev, selectedUser]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUser, currentUser?.username, guestUsername, conversationPartners]);

  // Fetch messages when a user is selected
  useEffect(() => {
    const activeUsername = currentUser?.username || guestUsername;
    if (!selectedUser || !activeUsername) return;

    fetchMessages();
  }, [selectedUser, currentUser?.username, guestUsername, fetchMessages]);


  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) {
      setSearchError('Please enter a username');
      return;
    }

    const activeUsername = currentUser?.username || guestUsername;
    if (searchUsername === activeUsername) {
      setSearchError('You cannot message yourself');
      return;
    }

    setSearchError(null);
    setLoading(true);

    try {
      const exists = await checkUserExists(searchUsername.trim());
      if (exists) {
        setSelectedUser(searchUsername.trim());
        setSearchUsername('');
        setSearchError(null);
      } else {
        setSearchError('User not found');
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Failed to search user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeUsername = currentUser?.username || guestUsername;
    if (!newMessage.trim() || !selectedUser || !activeUsername) return;

    try {
      const sentMsg = await sendMessage(activeUsername, selectedUser, newMessage.trim());
      setMessages(prev => [...prev, sentMsg]);
      setNewMessage('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Messages</h1>
            {currentUser ? (
              <div className="text-gray-700">
                Logged in as: <span className="font-semibold">{currentUser.username}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <label htmlFor="guestUsername" className="text-sm text-gray-700">
                  Your username:
                </label>
                <input
                  id="guestUsername"
                  type="text"
                  value={guestUsername}
                  onChange={(e) => setGuestUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="px-3 py-1 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Conversations list */}
          <div className="w-1/3 border-r flex flex-col">
            <div className="p-4 border-b">
              <form onSubmit={handleSearchUser}>
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Search username..."
                  className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                />
                {searchError && (
                  <p className="text-red-500 text-sm mt-1">{searchError}</p>
                )}
              </form>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversationPartners.length > 0 ? (
                conversationPartners.map((username) => (
                  <div
                    key={username}
                    onClick={() => setSelectedUser(username)}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition ${
                      selectedUser === username ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">{username}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500 text-center">
                  No conversations yet. Search for a user to start chatting!
                </div>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedUser && (
              <div className="p-4 border-b bg-white flex justify-between items-center">
                <h2 className="font-semibold text-gray-900">Conversation with {selectedUser}</h2>
                <button
                  onClick={fetchMessages}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center gap-1"
                  title="Refresh messages"
                >
                  <svg
                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>
            )}

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading && <div className="p-4 text-center text-gray-500">Loading messages...</div>}
              {error && <div className="p-4 text-red-500 text-center">{error}</div>}
              {!loading && !error && !selectedUser && (
                <div className="text-center text-gray-500 py-8">
                  Search for a user to start a conversation
                </div>
              )}
              {!loading && !error && selectedUser && messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start a conversation!
                </div>
              )}
              {!loading && !error && messages.length > 0 && (
                <>
                  {messages.map((message) => {
                    const activeUsername = currentUser?.username || guestUsername;
                    return (
                      <MessageItem
                        key={message.id}
                        message={message}
                        isCurrentUser={message.fromUsername === activeUsername}
                      />
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message input */}
            {selectedUser && (
              <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}