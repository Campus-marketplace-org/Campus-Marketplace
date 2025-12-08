// API functions for messaging
import { Message } from '@/src/types/message';
import { getToken } from '@/src/lib/api/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function authHeaders(extra: Record<string, string> = {}) {
    const token = getToken();
    return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

export async function getMessagesBetweenUsers(username1: string, username2: string): Promise<Message[]> {
    const url = `${API_BASE_URL}/messages/between?username1=${encodeURIComponent(username1)}&username2=${encodeURIComponent(username2)}`;
    const response = await fetch(url, {
        headers: authHeaders()
    });

    if (response.status === 403) {
        throw new Error('Forbidden: Invalid or missing authentication token');
    }
    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }

    return response.json();
}

export async function sendMessage(fromUsername: string, toUsername: string, content: string): Promise<Message> {
    const url = `${API_BASE_URL}/messages/send?fromUsername=${encodeURIComponent(fromUsername)}&toUsername=${encodeURIComponent(toUsername)}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'text/plain' }),
        body: content
    });

    if (response.status === 403) {
        throw new Error('Forbidden: Invalid or missing authentication token');
    }
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send message');
    }

    return response.json();
}

export async function checkUserExists(username: string): Promise<boolean> {
    const url = `${API_BASE_URL}/users/exists/${encodeURIComponent(username)}`;
    const response = await fetch(url, {
        headers: authHeaders()
    });

    if (response.status === 403) {
        throw new Error('Forbidden: Invalid or missing authentication token');
    }
    if (!response.ok) {
        throw new Error('Failed to check user existence');
    }

    return response.json();
}
