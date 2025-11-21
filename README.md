# Smart Link Website - Frontend

A modern, responsive web application for managing and displaying curated website links with AI-generated descriptions.

## Overview

This is the frontend for the Smart Link Website project, built with Next.js 16, Redux Toolkit, and Styled Components. It provides a beautiful user interface for browsing curated links and an admin dashboard for managing them.

## Features

### Public Features
- **Homepage**: Browse all website links displayed as beautiful, interactive cards
- **Category Filtering**: Filter links by categories (Technology, Design, News, etc.)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **External Link Navigation**: Click any card to open the website in a new tab

### Admin Features
- **Dashboard**: Comprehensive admin panel for link management
- **CRUD Operations**: Create, Read, Update, and Delete website links
- **AI Description Generation**: Generate descriptions using Google Gemini AI
- **Search & Filter**: Search by title/URL and filter by category
- **Form Validation**: Client-side validation for all inputs
- **Real-time Updates**: Redux state management for instant UI updates

### Authentication
- **Signup**: Create new user accounts
- **Login**: Secure JWT-based authentication
- **Role-based Access**: Admin and regular user roles
- **Protected Routes**: Admin dashboard accessible only to admins

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Styled Components](https://styled-components.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Language**: JavaScript (ES6+)
- **Font**: Geist Sans & Geist Mono

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.js          # Admin dashboard page
│   ├── login/
│   │   └── page.js              # Login page
│   ├── signup/
│   │   └── page.js              # Signup page
│   ├── layout.js                # Root layout with providers
│   ├── page.js                  # Public homepage
│   └── globals.css              # Global styles
├── components/
│   ├── ReduxProvider.js         # Redux provider wrapper
│   └── StyledComponentsRegistry.js  # Styled components setup
├── store/
│   ├── index.js                 # Redux store configuration
│   ├── authSlice.js             # Authentication state management
│   └── sitesSlice.js            # Sites/links state management
└── services/
    └── api.js                   # API service with Axios
```

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Backend API**: Running backend server (see backend README)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd abc
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   Replace `http://localhost:5000` with your backend API URL.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## API Integration

The frontend connects to the backend via the following endpoints:

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login

### Sites Management
- `GET /api/sites` - Fetch all sites
- `GET /api/sites/:id` - Fetch single site
- `POST /api/sites` - Create new site (admin only)
- `PUT /api/sites/:id` - Update site (admin only)
- `DELETE /api/sites/:id` - Delete site (admin only)

### AI Integration
- `POST /api/ai/generate-description` - Generate AI description

## User Roles

### Regular User
- View all public links on homepage
- Filter links by category
- Click links to visit websites
- No ability to create/edit/delete links

### Admin User
- All regular user capabilities
- Access to admin dashboard
- Create, edit, and delete links
- Use AI to generate descriptions
- Search and filter in admin panel

## Pages

### `/` - Homepage
- Public page displaying all links as cards
- Category filter buttons
- Responsive grid layout
- Login button for unauthenticated users
- Dashboard button for admins

### `/login` - Login Page
- Email and password authentication
- Redirects to dashboard (admins) or home (users)
- Link to signup page

### `/signup` - Signup Page
- Create new account with username, email, password
- Default role: user
- Password confirmation validation
- Redirects to login on success

### `/admin/dashboard` - Admin Dashboard
- Protected route (admin only)
- Form to add/edit links
- AI description generation button
- Table of all links with search/filter
- Edit and delete actions
- Responsive design for all screen sizes

## State Management

### Redux Slices

#### Auth Slice (`authSlice.js`)
Manages user authentication state:
- Login/logout actions
- User data storage
- JWT token management
- Authentication status

#### Sites Slice (`sitesSlice.js`)
Manages website links state:
- CRUD operations
- AI description generation
- Loading and error states
- Site list management

## Styling

The application uses Styled Components for all styling:
- **Component-scoped styles**: No CSS conflicts
- **Dynamic styling**: Props-based styling
- **Responsive design**: Media queries for all screen sizes
- **Theme**: Purple gradient theme (#667eea to #764ba2)

### Design Features
- Gradient backgrounds
- Card-based layouts
- Smooth animations and transitions
- Glassmorphism effects
- Shadow and hover effects

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### API Connection Issues
- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured on backend

### Styled Components Not Working
- Clear `.next` cache:
  ```bash
  rm -rf .next
  npm run dev
  ```

### Redux State Not Persisting
- Check browser localStorage
- Verify JWT token is being saved
- Check browser console for errors

## Deployment

### Vercel (Recommended)

1. Push code to GitHub/GitLab/Bitbucket

2. Import project to Vercel:
   ```bash
   npm install -g vercel
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your production backend URL

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean App Platform

**Important**: Always set the `NEXT_PUBLIC_API_URL` environment variable to your production backend URL.

## Performance Optimizations

- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization with Next.js Image
- Redux state caching
- Axios request interceptors
- Lazy loading of routes

## Security Features

- JWT token storage in localStorage
- Protected routes with authentication checks
- Role-based access control
- XSS protection via React
- CSRF protection via token-based auth
- Input validation on forms

## Development Tips

1. **Hot Reload**: Changes are automatically reflected in the browser
2. **Redux DevTools**: Install Redux DevTools extension for debugging
3. **React DevTools**: Install React DevTools for component inspection
4. **Console Logging**: Check browser console for API errors

## Future Enhancements

- [ ] Pagination for large lists
- [ ] Bookmark/favorite functionality
- [ ] Social sharing buttons
- [ ] Dark/light mode toggle
- [ ] Advanced search with filters
- [ ] User profiles
- [ ] Analytics dashboard
- [ ] Comments/ratings system

## License

This project is part of the XIHawks Developer Task assessment.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend README for API issues
3. Check browser console for errors
4. Verify environment variables are set correctly
