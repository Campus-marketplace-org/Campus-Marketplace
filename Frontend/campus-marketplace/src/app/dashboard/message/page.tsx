'use client';

import { useState } from 'react';
import { Message } from '@/src/types/message';
import { CONFIG, MOCK_MESSAGES, getCurrentUser, getMessagesBetweenUsers } from '@/src/config/mockData';

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
  // Use mock data and auth configuration
  const currentUser = CONFIG.USE_MOCK_AUTH ? getCurrentUser() : null;
  const [messages] = useState<Message[]>(CONFIG.USE_PLACEHOLDER_DATA ? MOCK_MESSAGES : []);
  const [newMessage, setNewMessage] = useState('');
  // In a real app, this would come from authentication context
  const currentUserId = currentUser?.id || CONFIG.MOCK_USER_ID;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // TODO: Implement actual message sending
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  // Get unique conversation partners
  const conversationPartners = Array.from(
    new Set(
      messages
        .flatMap(msg => [msg.from, msg.to])
        .filter(user => user.id !== currentUserId)
        .map(user => JSON.stringify(user))
    )
  ).map(str => JSON.parse(str));

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="border-b py-4">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Conversations list */}
          <div className="w-1/4 border-r">
            <div className="p-4">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="overflow-y-auto">
              {conversationPartners.length > 0 ? (
                conversationPartners.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">No conversations yet</div>
              )}
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 flex flex-col">
            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isCurrentUser={message.from.id === currentUserId}
                  />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start a conversation!
                </div>
              )}
            </div>

            {/* Message input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}