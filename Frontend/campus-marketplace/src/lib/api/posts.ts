// API functions for posts
import { Post } from '@/src/types/post';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Helper to get auth token
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('jwt_token');
}

// Helper to create auth headers
function authHeaders(extra: Record<string, string> = {}) {
  const token = getToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

export async function getAllPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}

export async function getMyPosts(): Promise<Post[]> {
  const response = await fetch(`${API_BASE_URL}/posts/mine`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch your posts');
  }
  return response.json();
}

export async function getPostById(id: number): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
}

export async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
}

export async function createPostWithImage(
  postData: {
    title: string;
    description: string;
    askingPrice: number;
    category: string;
  },
  imageFile?: File
): Promise<Post> {
  const formData = new FormData();
  formData.append('post', JSON.stringify(postData));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
}

export async function updatePost(
  id: number,
  postData: {
    title: string;
    description: string;
    askingPrice: number;
    category: string;
  },
  imageFile?: File
): Promise<Post> {
  const formData = new FormData();
  formData.append('post', JSON.stringify(postData));
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to update post');
  }
  return response.json();
}

export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
}

