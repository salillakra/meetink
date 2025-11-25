# OAuth Authentication Setup Guide

## Overview
This implementation provides Google OAuth authentication with JWT tokens for the Meetink platform.

## Features Implemented

### Backend (FastAPI)
1. **Google OAuth Login** - `/auth/login/google`
2. **OAuth Callback Handler** - `/auth/callback/google`
3. **User Authentication Check** - `/auth/me`
4. **Logout** - `/auth/logout`
5. **User Model** - MongoDB collection for storing user data
6. **JWT Token Management** - Secure token generation and validation

### Frontend (Next.js)
1. **Auth Context Provider** - Global authentication state management
2. **User Menu Component** - Login/logout interface with dropdown menu
3. **Auth Success Page** - Beautiful profile page showing user details
4. **Navbar Component** - Global navigation with auth integration
5. **Protected Routes** - Auth-aware components

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd server
source ../.venv/bin/activate
pip install -r requirements.txt
```

#### Configure Environment Variables
Create a `.env` file in the `server` directory:

```env
DATABASE_URL=mongodb://localhost:27017/meetink
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET_KEY=your-session-secret-key
```

#### Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:8000/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env` file

#### Start the Server
```bash
cd server
uvicorn main:app --reload
```

### 2. Frontend Setup

The frontend is already configured! Just start the development server:

```bash
cd frontend
npm run dev
```

## How It Works

### Authentication Flow

1. **User clicks "Sign in with Google"** on the frontend
2. **Redirects to** `http://localhost:8000/auth/login/google`
3. **Google OAuth consent screen** appears
4. **User approves** and Google redirects to `/auth/callback/google`
5. **Backend:**
   - Receives OAuth token from Google
   - Fetches user info
   - Creates/updates user in MongoDB
   - Generates JWT token
   - Sets httpOnly cookie with JWT
   - Redirects to `http://localhost:3000/auth/success`
6. **Frontend success page:**
   - Fetches user data from `/auth/me`
   - Displays beautiful profile page

### API Endpoints

#### `GET /auth/login/google`
Initiates Google OAuth flow
- **Response:** Redirects to Google consent screen

#### `GET /auth/callback/google`
Handles OAuth callback from Google
- **Response:** Sets cookie and redirects to success page

#### `GET /auth/me`
Returns current user data (requires authentication)
- **Headers:** Cookie with `access_token`
- **Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "provider": "google",
  "role": "user",
  "created_at": "2025-11-25T..."
}
```

#### `POST /auth/logout`
Logs out the user by clearing the cookie
- **Response:** Success message

### User Data Model

```python
{
  "email": str,           # User's email
  "name": str | None,     # Display name
  "picture": str | None,  # Profile picture URL
  "provider": str,        # OAuth provider (google)
  "provider_id": str,     # Google user ID
  "role": str,           # User role (default: "user")
  "created_at": datetime  # Account creation timestamp
}
```

## Components Usage

### Using Auth in Components

```tsx
'use client';
import { useAuth } from '@/components/AuthProvider';

export default function MyComponent() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <button onClick={login}>Login</button>;
  }
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### UserMenu Component
Already integrated in Hero and Navbar. Shows:
- Login button when not authenticated
- User avatar and dropdown menu when authenticated
- Profile, Confessions links
- Logout option

### Navbar Component
Global navigation with auth integration:
```tsx
import Navbar from '@/components/Navbar';

export default function Page() {
  return (
    <>
      <Navbar />
      {/* Your page content */}
    </>
  );
}
```

## Security Features

1. **HttpOnly Cookies** - JWT tokens stored in httpOnly cookies (not accessible via JavaScript)
2. **CORS Protection** - Configured to allow only trusted origins
3. **Session Management** - Secure session handling with secret keys
4. **JWT Expiration** - Tokens expire after 7 days
5. **Provider Verification** - User linked to OAuth provider

## File Structure

```
server/
├── api/
│   └── api.py              # Auth endpoints
├── auth/
│   ├── __init__.py
│   └── config.py           # OAuth configuration
├── models/
│   └── user.py             # User database model
├── graphql_types/
│   └── user.py             # GraphQL user type
├── database/
│   └── connection.py       # DB initialization
├── main.py                 # FastAPI app with middleware
├── requirements.txt        # Python dependencies
└── .env.example           # Environment template

frontend/
├── app/
│   ├── auth/
│   │   └── success/
│   │       └── page.tsx    # Profile page
│   └── layout.tsx          # Auth provider wrapper
├── components/
│   ├── AuthProvider.tsx    # Auth context
│   ├── UserMenu.tsx        # Login/user menu
│   ├── Navbar.tsx          # Navigation bar
│   └── Hero.tsx            # Updated with UserMenu
```

## Testing

1. Start backend: `cd server && uvicorn main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:3000`
4. Click "Sign in with Google" in the top right
5. Complete OAuth flow
6. View your profile at `/auth/success`

## Troubleshooting

### "SessionMiddleware must be installed"
- Ensure SessionMiddleware is added in `main.py` before CORS
- Check that `itsdangerous` is installed

### "No module named 'httpx'"
- Run: `pip install httpx`

### OAuth redirect mismatch
- Verify redirect URI in Google Console matches: `http://localhost:8000/auth/callback/google`

### Cookie not being set
- Check CORS `allow_credentials=True`
- Verify frontend uses `credentials: 'include'` in fetch requests

### User not found after login
- Check MongoDB connection
- Verify User model is in `database/connection.py` document_models

## Next Steps

- [ ] Add GitHub OAuth provider
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Role-based access control
- [ ] Admin dashboard
- [ ] User profile editing
- [ ] Account deletion

## Support

For issues, check the error logs in:
- Backend: Terminal running uvicorn
- Frontend: Browser console (F12)
