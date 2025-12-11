# Campus Marketplace - Frontend Setup

## Overview

Campus Marketplace is a platform that connects students, staff, and universities across the country. Users can post, browse, and message about items for sale, trade, or exchange in a safe, campus-oriented environment.

This guide will help you set up and run the **frontend application** locally.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20.x or higher recommended)
- **npm** (comes with Node.js) or **yarn** or **pnpm**

To check if you have Node.js and npm installed:

```bash
node --version
npm --version
```

---

## Getting Started

### 1. Navigate to the Frontend Directory

```bash
cd Frontend/campus-marketplace
```

### 2. Install Dependencies

Install all required packages:

```bash
npm install
```

Or if you prefer yarn or pnpm:

```bash
yarn install
# or
pnpm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Or with yarn/pnpm:

```bash
yarn dev
# or
pnpm dev
```

The application will start on **http://localhost:3000**

### 4. Open in Browser

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will automatically reload when you make changes to the code.

---

## Available Scripts

In the `Frontend/campus-marketplace` directory, you can run:

- **`npm run dev`** - Runs the app in development mode with Turbopack
- **`npm run build`** - Builds the app for production
- **`npm start`** - Runs the production build
- **`npm run lint`** - Runs ESLint to check code quality

---

## Project Structure

```
Frontend/campus-marketplace/
├── src/
│   ├── app/              # Next.js app directory (pages and layouts)
│   ├── components/       # Reusable React components
│   ├── lib/             # Utility functions and API clients
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── package.json         # Project dependencies and scripts
```

---

## Technology Stack

- **Next.js 15** - React framework with App Router
- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first CSS framework
- **Turbopack** - Fast bundler for development

---

## Development Tips

- The main page is located at `src/app/page.tsx`
- Layout components are in `src/app/layout.tsx`
- API routes can be added in `src/app/api/` directory
- Components are organized in `src/components/`
- Styling uses Tailwind CSS classes

---

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
PORT=3001 npm run dev
```

### Clear Cache and Reinstall

If you encounter dependency issues:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## Backend Setup

For backend setup instructions, please refer to:
- [Backend Setup Guide](/backend/BACKEND_SETUP.md)

---

## Support

If you encounter any issues, please check:
1. You're in the correct directory (`Frontend/campus-marketplace`)
2. All dependencies are installed (`npm install`)
3. You're using a compatible Node.js version (20.x or higher)

For additional help, contact your team lead or check the project documentation.
