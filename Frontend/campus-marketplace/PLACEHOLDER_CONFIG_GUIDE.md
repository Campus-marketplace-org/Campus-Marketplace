# Placeholder Data and Mock Authentication Configuration

## Overview

The frontend now includes a centralized configuration system for placeholder data and mock authentication. This allows you to easily toggle between using real API data and mock/placeholder data without modifying component code.

## Configuration File

The configuration is located at: `src/config/mockData.ts`

### Key Configuration Options

```typescript
export const CONFIG = {
  // Enable/disable placeholder data (default: true)
  USE_PLACEHOLDER_DATA: true,
  
  // Enable/disable mock authentication (default: true)
  // When true, the user is considered signed in
  USE_MOCK_AUTH: true,
  
  // Mock user ID (used when USE_MOCK_AUTH is true, default: 1)
  MOCK_USER_ID: 1,
  
  // Mock username (used when USE_MOCK_AUTH is true)
  MOCK_USERNAME: 'currentuser',
};
```

## How to Toggle Features

### Enable Mock Data and Auth

```typescript
// src/config/mockData.ts
export const CONFIG = {
  USE_PLACEHOLDER_DATA: true,   // Use mock data
  USE_MOCK_AUTH: true,           // User is signed in
  // ... rest of config
};
```

### Disable Mock Data (Use Real API) and Auth

```typescript
// src/config/mockData.ts
export const CONFIG = {
  USE_PLACEHOLDER_DATA: false,  // Fetch from API
  USE_MOCK_AUTH: false,          // No user is signed in
  // ... rest of config
};
```

### Use Real API but Keep Mock Auth

```typescript
// src/config/mockData.ts
export const CONFIG = {
  USE_PLACEHOLDER_DATA: false,  // Fetch from API
  USE_MOCK_AUTH: true,           // User is signed in
  // ... rest of config
};
```

## Mock Data Included

### Mock Users (4 users)
- `currentuser` (ID: 1) - The current logged-in user
- `john_doe` (ID: 2)
- `jane_smith` (ID: 3)
- `mike_johnson` (ID: 4)

Each user has: `id`, `username`, `email`, `college`

### Mock Posts (8 posts)
Posts across various categories:
- **Textbooks**: Calculus, Organic Chemistry
- **Electronics**: Gaming Laptop, USB-C Hub
- **Furniture**: Wooden Desk
- **Clothing**: Winter Jacket
- **School Supplies**: Lab Notebooks
- **Other**: Bike Accessories

Each post has: `id`, `title`, `description`, `askingPrice`, `category`, `imageUrl`, `Owner` (User object)

### Mock Messages (8 messages)
Messages between various users showing conversations about posts.

Each message has: `id`, `from` (User object), `to` (User object), `content`, `timestamp`

## Components and Pages Using Configuration

### Components
- **PostCards.tsx** (`PostCardList` component)
  - Uses `CONFIG.USE_PLACEHOLDER_DATA` to fetch from mock data or API
  - Uses `isSignedIn()` to determine message button behavior
- **layout/Header.tsx**
  - Uses `isSignedIn()` to display navigation based on authentication status

### Pages
- **browse/page.tsx** - Browse all posts
  - Shows multi-category filter for signed-in users
  - Shows single-category dropdown for non-signed-in users
  - Displays PostCard component for signed-in users with messaging capability
  - Displays card grid for non-signed-in users (view only)
- **browse/post/[id]/page.tsx** - View post details
- **dashboard/page.tsx** - Dashboard with recent posts
- **dashboard/post/page.tsx** - Create post (uses real API for creation)

## Helper Functions Available

```typescript
// Check if placeholder data should be used
CONFIG.USE_PLACEHOLDER_DATA: boolean

// Check if user is signed in
isSignedIn(): boolean

// Get current signed-in user
getCurrentUser(): User

// Get user by ID
getUserById(userId: number): User | undefined

// Get posts by user ID
getPostsByUser(userId: number): Post[]

// Get messages between two users (sorted by timestamp)
getMessagesBetweenUsers(user1Id: number, user2Id: number): Message[]
```

## Example: Switching Between Modes

### Mode 1: Development with Mock Data (Default)
```typescript
export const CONFIG = {
  USE_PLACEHOLDER_DATA: true,   // See everything instantly
  USE_MOCK_AUTH: true,           // Logged in as 'currentuser'
  MOCK_USER_ID: 1,
  MOCK_USERNAME: 'currentuser',
};
```

### Mode 2: Testing API Integration (No Auth)
```typescript
export const CONFIG = {
  USE_PLACEHOLDER_DATA: false,  // Fetch from real API
  USE_MOCK_AUTH: false,          // Not logged in
  MOCK_USER_ID: 1,
  MOCK_USERNAME: 'currentuser',
};
```

### Mode 3: Testing Authenticated Features
```typescript
export const CONFIG = {
  USE_PLACEHOLDER_DATA: false,  // Fetch from real API
  USE_MOCK_AUTH: true,           // Logged in
  MOCK_USER_ID: 1,
  MOCK_USERNAME: 'currentuser',
};
```

### Mode 4: Test as Different User
```typescript
export const CONFIG = {
  USE_PLACEHOLDER_DATA: true,   // Use mock data
  USE_MOCK_AUTH: true,           // Logged in
  MOCK_USER_ID: 3,               // Logged in as jane_smith
  MOCK_USERNAME: 'jane_smith',
};
```

## Important Notes

1. **Image URLs**: All mock posts use placeholder images from `https://via.placeholder.com/`. These are generated on-the-fly and may not always be available. The app will continue to work even if these fail to load.

2. **Fallback Behavior**: When `USE_PLACEHOLDER_DATA` is true, the app will always use mock data. If it's false and an API request fails, the app will show an error but won't fall back to mock data automatically.

3. **Authentication Context**: The current implementation uses the `CONFIG.USE_MOCK_AUTH` flag for demonstration. In production, this should be replaced with a proper authentication context provider.

4. **Extending Mock Data**: To add more mock data, edit the arrays in `src/config/mockData.ts`:
   - `MOCK_USERS`
   - `MOCK_POSTS`
   - `MOCK_MESSAGES`

## Future Enhancements

1. Create a proper Authentication Context to manage login/logout
2. Add database seeding functionality to populate the backend with these mock records
3. Add a UI toggle in the app header to switch between modes without code changes
4. Implement localStorage persistence for the CONFIG settings
