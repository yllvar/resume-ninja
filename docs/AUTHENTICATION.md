# Authentication System

This document describes the authentication system implemented in Resume Ninja using Supabase.

## Overview

The application uses Supabase for authentication with the following features:
- Email/Password authentication
- Password reset functionality
- Protected routes
- Session management
- User profile creation

## Authentication Flow

### Sign Up
1. User navigates to `/auth/sign-up`
2. Fills out full name, email, and password
3. Submits the form
4. Receives confirmation email
5. Clicks confirmation link to verify email
6. Redirected to dashboard

### Sign In
1. User navigates to `/auth/login`
2. Enters email and password
3. Submits the form
4. If successful, redirected to dashboard or intended page

### Password Reset
1. User navigates to `/auth/forgot-password`
2. Enters email address
3. Receives password reset email
4. Clicks reset link
5. Sets new password
6. Can sign in with new password

## File Structure

```
app/
├── auth/
│   ├── layout.tsx              # Auth layout wrapper
│   ├── login/
│   │   └── page.tsx           # Sign in page
│   ├── sign-up/
│   │   └── page.tsx           # Sign up page
│   ├── sign-up-success/
│   │   └── page.tsx           # Email confirmation page
│   ├── forgot-password/
│   │   └── page.tsx           # Password reset request
│   └── reset-password/
│       └── page.tsx           # Set new password
└── layout.tsx                 # Root layout with AuthProvider

lib/
├── auth.tsx                   # Auth context and provider
├── supabase/
│   ├── client.ts              # Browser client
│   ├── server.ts              # Server client
│   ├── admin.ts               # Admin client (for webhooks)
│   ├── middleware.ts          # Session management
│   └── types.ts               # Type definitions

components/
├── protected-route.tsx        # Route protection wrapper
└── user-nav.tsx               # User navigation dropdown

middleware.ts                   # Route protection middleware
```

## Environment Variables

Required environment variables in `.env`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Redirect URL (for development)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

## Protected Routes

The following routes are protected and require authentication:
- `/dashboard` - Main user dashboard
- `/optimize` - Resume optimization page

Protected routes are handled by:
1. **Middleware** (`middleware.ts`) - Server-side route protection
2. **ProtectedRoute component** - Client-side protection

## User Profile Creation

When a user signs up, a profile is automatically created in the `profiles` table via a database trigger (`scripts/003_create_profile_trigger.sql`).

The profile includes:
- User ID (from auth.users)
- Email address
- Full name (from sign-up form)
- Default credits (3 for free tier)
- Subscription tier (free)

## Session Management

Sessions are managed through:
- **Middleware**: Updates session on each request
- **AuthProvider**: Client-side state management
- **Cookies**: Secure session storage

## Security Features

1. **Row Level Security (RLS)**: Enabled on all tables
2. **Middleware Protection**: Server-side route protection
3. **Secure Headers**: XSS protection, content type options
4. **Password Requirements**: Minimum 6 characters
5. **Email Verification**: Required for account activation

## Usage Examples

### Using the Auth Context

```tsx
"use client"

import { useAuth } from "@/lib/auth"

function MyComponent() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) return <div>Please sign in</div>

  return (
    <div>
      Welcome, {user.email}!
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Protecting a Route

```tsx
import { ProtectedRoute } from "@/components/protected-route"

function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  )
}
```

### Server-side Auth Check

```tsx
import { createClient } from "@/lib/supabase/server"

async function ServerComponent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Handle unauthenticated state
    return <div>Please sign in</div>
  }

  // User is authenticated
  return <div>Welcome, {user.email}</div>
}
```

## Database Schema

### profiles Table

```sql
create table public.profiles (
  id uuid not null primary key,
  email text,
  full_name text,
  credits integer default 3 not null,
  subscription_tier text default 'free'::text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policy
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
```

## Troubleshooting

### Common Issues

1. **Email not received**: Check email configuration in Supabase project settings
2. **Redirect loops**: Ensure middleware is properly configured
3. **Session not persisting**: Check cookie settings and domain configuration
4. **RLS errors**: Verify policies are correctly set up

### Debug Mode

Enable debug mode by setting:
```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## Best Practices

1. Always use the `ProtectedRoute` component for client-side protection
2. Verify user permissions server-side for sensitive operations
3. Handle loading states properly when checking authentication
4. Use the AuthProvider context for client-side auth state
5. Implement proper error handling for auth operations
6. Test email flows in both development and production
