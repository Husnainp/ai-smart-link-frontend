# Quick Start Guide

Get the Smart Link Website frontend up and running in 5 minutes!

## Prerequisites

- Node.js v18+ installed
- Backend API running (see backend setup)
- npm or yarn package manager

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and update it:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set your backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## First Steps

### 1. Create an Account

1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Fill in username, email, and password
3. Click "Sign Up"

**Note**: First user created should be manually set to admin in the database, or use the backend admin creation endpoint.

### 2. Login

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your credentials
3. Admins will be redirected to the dashboard
4. Regular users will see the homepage

### 3. Add Your First Link (Admin Only)

1. Access the admin dashboard at [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
2. Fill in the form:
   - **Website URL**: `https://github.com`
   - **Title**: `GitHub`
   - **Category**: `Technology`
   - **Cover Image**: `https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png` (optional)
3. Click "Ask AI for Description" to generate a description
4. Click "Add Link" to save

### 4. View Public Homepage

1. Visit [http://localhost:3000](http://localhost:3000)
2. See your links displayed as beautiful cards
3. Click any card to visit the website
4. Use category filters to filter links

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Troubleshooting

### Cannot connect to backend
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check backend CORS settings

### Port 3000 in use
```bash
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
PORT=3001 npm run dev           # Use different port
```

### Build fails
```bash
rm -rf .next node_modules       # Clean install
npm install
npm run build
```

## Default Categories

- Technology
- Design
- News
- Education
- Entertainment
- Business
- Health
- Other

## API Endpoints (Backend Required)

Make sure your backend implements these endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/sites` - Fetch all sites
- `POST /api/sites` - Create site (admin)
- `PUT /api/sites/:id` - Update site (admin)
- `DELETE /api/sites/:id` - Delete site (admin)
- `POST /api/ai/generate-description` - Generate AI description

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Configure your backend API properly
- Deploy to production (Vercel recommended)
- Customize the design to your liking

## Need Help?

1. Check the full README.md
2. Review backend documentation
3. Check browser console for errors
4. Verify all environment variables are set

Happy coding!
