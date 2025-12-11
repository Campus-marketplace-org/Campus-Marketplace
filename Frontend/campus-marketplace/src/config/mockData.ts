// Configuration for placeholder data and mock authentication
// Set these booleans to enable/disable placeholder data and mock authentication

export const CONFIG = {
  // Enable/disable placeholder data
  USE_PLACEHOLDER_DATA: false,
  // Enable/disable mock authentication (when true, user is considered signed in)
  USE_MOCK_AUTH: false,
  // Mock user ID (used when USE_MOCK_AUTH is true)
  MOCK_USER_ID: 1,
  // Mock username
  MOCK_USERNAME: 'currentuser',
};

// Mutable auth state for placeholder data mode
let mockAuthState = CONFIG.USE_MOCK_AUTH;

// Helper function to sign out (only works with placeholder data)
export const signOut = () => {
  if (CONFIG.USE_PLACEHOLDER_DATA) {
    mockAuthState = false;
    // Dispatch custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isSignedIn: false } }));
    }
  }
};

// Helper function to sign in (only works with placeholder data)
export const signIn = () => {
  if (CONFIG.USE_PLACEHOLDER_DATA) {
    mockAuthState = true;
    // Dispatch custom event to notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: { isSignedIn: true } }));
    }
  }
};

// ============= MOCK DATA =============

// Mock Users
export const MOCK_USERS = [
  {
    id: 1,
    username: 'currentuser',
    email: 'current@campus.edu',
    college: 'Engineering',
  },
  {
    id: 2,
    username: 'john_doe',
    email: 'john@campus.edu',
    college: 'Liberal Arts',
  },
  {
    id: 3,
    username: 'jane_smith',
    email: 'jane@campus.edu',
    college: 'Business',
  },
  {
    id: 4,
    username: 'mike_johnson',
    email: 'mike@campus.edu',
    college: 'Engineering',
  },
];

// Mock Posts
export const MOCK_POSTS = [
  {
    id: 1,
    title: 'Used Calculus Textbook',
    description: 'Calculus textbook for Math 101. Some highlighting but in great condition. Asking $45.',
    askingPrice: 45,
    category: 'Textbooks',
    imageUrl: 'https://via.placeholder.com/300x400?text=Calculus+Textbook',
    Owner: MOCK_USERS[1],
  },
  {
    id: 2,
    title: 'Gaming Laptop',
    description: 'Dell G15 gaming laptop. 16GB RAM, RTX 4060, barely used. Perfect for gaming and coursework.',
    askingPrice: 899,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x400?text=Gaming+Laptop',
    Owner: MOCK_USERS[2],
  },
  {
    id: 3,
    title: 'Wooden Desk',
    description: 'Solid oak wooden desk, 5 years old but very sturdy. Great for dorm room or study space.',
    askingPrice: 120,
    category: 'Furniture',
    imageUrl: 'https://via.placeholder.com/300x400?text=Wooden+Desk',
    Owner: MOCK_USERS[3],
  },
  {
    id: 4,
    title: 'Winter Jacket',
    description: 'North Face winter jacket, size M. Never worn, still has tags. Perfect for upcoming season.',
    askingPrice: 75,
    category: 'Clothing',
    imageUrl: 'https://via.placeholder.com/300x400?text=Winter+Jacket',
    Owner: MOCK_USERS[1],
  },
  {
    id: 5,
    title: 'Physics Lab Notebook',
    description: 'Bundle of 3 physics lab notebooks. Used for Physics 201. Notes are comprehensive.',
    askingPrice: 20,
    category: 'School Supplies',
    imageUrl: 'https://via.placeholder.com/300x400?text=Lab+Notebooks',
    Owner: MOCK_USERS[2],
  },
  {
    id: 6,
    title: 'Bike Lock and Helmet',
    description: 'Kryptonite bike lock and safety helmet. Great condition. Perfect starter set.',
    askingPrice: 55,
    category: 'Other',
    imageUrl: 'https://via.placeholder.com/300x400?text=Bike+Accessories',
    Owner: MOCK_USERS[3],
  },
  {
    id: 7,
    title: 'Organic Chemistry Textbook',
    description: 'Organic Chemistry 7th edition. Highlights in margins, but spine is still strong.',
    askingPrice: 65,
    category: 'Textbooks',
    imageUrl: 'https://via.placeholder.com/300x400?text=Org+Chemistry',
    Owner: MOCK_USERS[0],
  },
  {
    id: 8,
    title: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader. Works perfectly.',
    askingPrice: 35,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x400?text=USB+Hub',
    Owner: MOCK_USERS[1],
  },
];

// Mock Messages
export const MOCK_MESSAGES = [
  {
    id: 1,
    from: MOCK_USERS[1],
    to: MOCK_USERS[0],
    content: 'Hi! Is the Calculus textbook still available?',
    timestamp: new Date(2025, 10, 20, 14, 30).toISOString(),
  },
  {
    id: 2,
    from: MOCK_USERS[0],
    to: MOCK_USERS[1],
    content: 'Yes, it is! Are you interested?',
    timestamp: new Date(2025, 10, 20, 14, 35).toISOString(),
  },
  {
    id: 3,
    from: MOCK_USERS[1],
    to: MOCK_USERS[0],
    content: 'Great! When can we meet?',
    timestamp: new Date(2025, 10, 20, 14, 40).toISOString(),
  },
  {
    id: 4,
    from: MOCK_USERS[2],
    to: MOCK_USERS[0],
    content: 'Is the Winter Jacket still available?',
    timestamp: new Date(2025, 10, 19, 10, 15).toISOString(),
  },
  {
    id: 5,
    from: MOCK_USERS[0],
    to: MOCK_USERS[2],
    content: 'Yes! Perfect condition, never worn.',
    timestamp: new Date(2025, 10, 19, 10, 20).toISOString(),
  },
  {
    id: 6,
    from: MOCK_USERS[2],
    to: MOCK_USERS[0],
    content: 'Awesome, I might come by tomorrow!',
    timestamp: new Date(2025, 10, 19, 10, 25).toISOString(),
  },
  {
    id: 7,
    from: MOCK_USERS[3],
    to: MOCK_USERS[0],
    content: 'Hi, interested in the Wooden Desk. Condition?',
    timestamp: new Date(2025, 10, 18, 16, 45).toISOString(),
  },
  {
    id: 8,
    from: MOCK_USERS[0],
    to: MOCK_USERS[3],
    content: 'Very solid oak, no damage. Can deliver if needed.',
    timestamp: new Date(2025, 10, 18, 16, 50).toISOString(),
  },
];

// Helper function to get mock data or use provided data
export const getDataWithFallback = <T,>(realData: T | null, mockData: T): T => {
  if (CONFIG.USE_PLACEHOLDER_DATA && !realData) {
    return mockData;
  }
  return realData || mockData;
};

// Helper function to check if user is signed in
export const isSignedIn = (): boolean => {
  return mockAuthState;
};

// Helper function to get current user
export const getCurrentUser = () => {
  return MOCK_USERS.find(user => user.id === CONFIG.MOCK_USER_ID) || MOCK_USERS[0];
};

// Helper function to get user by ID
export const getUserById = (userId: number) => {
  return MOCK_USERS.find(user => user.id === userId);
};

// Helper function to get posts by user
export const getPostsByUser = (userId: number) => {
  return MOCK_POSTS.filter(post => post.Owner.id === userId);
};

// Helper function to get messages between two users
export const getMessagesBetweenUsers = (user1Id: number, user2Id: number) => {
  return MOCK_MESSAGES.filter(
    msg =>
      (msg.from.id === user1Id && msg.to.id === user2Id) ||
      (msg.from.id === user2Id && msg.to.id === user1Id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};
