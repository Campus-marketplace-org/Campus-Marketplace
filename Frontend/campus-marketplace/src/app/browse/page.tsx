'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/src/types/post'
import { CONFIG, MOCK_POSTS, isSignedIn } from '@/src/config/mockData'
import PostCard from '@/src/components/PostCards'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Simple component definitions
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`border rounded-lg shadow ${className}`}>
        {children}
    </div>
    )

const Input = ({ type, placeholder, value, onChange, className = '' }: { 
    type: string, 
    placeholder?: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string 
}) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border rounded px-4 py-2 w-full ${className}`}
    />
)

const Button = ({ children, variant = 'default', onClick, disabled = false }: {
    children: React.ReactNode,
    variant?: 'default' | 'outline',
    onClick?: () => void,
    disabled?: boolean
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded ${
            variant === 'default' 
                ? 'bg-blue-500 text-white' 
                : 'border border-gray-300'
        } ${disabled ? 'opacity-50' : ''}`}
    >
        {children}
    </button>
)

const Checkbox = ({ id, checked, onCheckedChange }: {
    id: string,
    checked: boolean,
    onCheckedChange: (checked: boolean) => void
}) => (
    <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="w-4 h-4"
    />
)

export default function BrowsePage() {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userSignedIn, setUserSignedIn] = useState(false)

    useEffect(() => {
        // Set initial auth state
        setUserSignedIn(isSignedIn())

        // Listen for auth changes
        const handleAuthChange = (event: Event) => {
            const customEvent = event as CustomEvent
            setUserSignedIn(customEvent.detail.isSignedIn)
        }

        window.addEventListener('auth-changed', handleAuthChange)
        return () => window.removeEventListener('auth-changed', handleAuthChange)
    }, [])

    const itemsPerPage = 9
    const categories = ['Books', 'Electronics', 'Furniture', 'Other']

    // Fetch posts from API
    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true)
                
                // Use placeholder data if enabled
                if (CONFIG.USE_PLACEHOLDER_DATA) {
                    setPosts(MOCK_POSTS)
                    setError(null)
                    setLoading(false)
                    return
                }

                const response = await fetch(`${API_BASE_URL}/posts`)
                if (!response.ok) {
                    throw new Error('Failed to fetch posts')
                }
                const data = await response.json()
                setPosts(data)
                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load posts')
                console.error('Error fetching posts:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    // Filter and search logic - handle both single and multiple category selection based on view
    const filteredItems = posts.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                            item.description.toLowerCase().includes(search.toLowerCase())
        
        if (userSignedIn) {
            // When signed in, support multiple category filtering
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category)
            return matchesSearch && matchesCategory
        } else {
            // When not signed in, support single category dropdown
            const matchesCategory = !selectedCategory || item.category === selectedCategory
            return matchesSearch && matchesCategory
        }
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePostClick = (postId: number) => {
        router.push(`/browse/post/${postId}`)
    }

    const handleMessage = (post: Post) => {
        if (userSignedIn) {
            router.push(`/dashboard/message?userId=${post.Owner.id}`)
        } else {
            alert('Sign in to message sellers')
        }
    }

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <h1 className="text-3xl font-bold mb-6">Browse Listings</h1>

            {/* Search Bar */}
            <div className="mb-8">
                <Input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xl border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}

            {/* Unified view for all users */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters Section */}
                <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                    <h3 className="text-lg font-semibold mb-4">Filters</h3>
                    <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-3">Categories</h4>
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedCategories([...selectedCategories, category])
                                            } else {
                                                setSelectedCategories(selectedCategories.filter(c => c !== category))
                                            }
                                            setCurrentPage(1)
                                        }}
                                    />
                                    <label htmlFor={category} className="text-sm cursor-pointer">{category}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Items Grid */}
                <div className="md:col-span-3">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Loading posts...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No posts found. Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {currentItems.map(post => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onViewDetails={() => handlePostClick(post.id)}
                                        onMessage={() => handleMessage(post)}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center space-x-2 mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}