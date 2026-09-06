# Creator Marketplace

A modern creator discovery platform with JWT-based authentication, built with Next.js and Express.

## Features

### Landing Page
- Clean, premium design with SF Pro typography
- Orange/Pink color palette
- Creator cards with hover effects
- Responsive layout

### Authentication System
- JWT-based authentication with httpOnly cookies
- User signup and login
- Account types: Brand or Creator
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Email and password validation

## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React (icons)

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- Rate limiting middleware

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB running locally or connection string

### Installation

1. **Clone and install dependencies:**
```bash
npm install
cd backend && npm install
```

2. **Set up environment variables:**

Copy `backend/.env.example` to `backend/.env` and fill in your values — it documents every
variable the backend reads (database, JWT, Cloudinary, Resend, PostHog, each OAuth
provider, the admin/cron secret, and the currently-disabled Razorpay config), with a
comment explaining what each one is for:
```bash
cp backend/.env.example backend/.env
```
At minimum, set `JWT_SECRET` and `MONGODB_URI` (or `DATABASE_URL`) to get the server running.

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

3. **Start MongoDB:**
```bash
mongod
```

4. **Run the backend:**
```bash
cd backend
npm run dev
```

5. **Run the frontend:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to `http://localhost:3000`

## API Endpoints

### Authentication

**POST** `/api/auth/signup`
- Create a new user account
- Body: `{ fullName, email, password, accountType }`
- Returns: User object and JWT token

**POST** `/api/auth/login`
- Authenticate existing user
- Body: `{ email, password }`
- Returns: User object and JWT token

**GET** `/api/auth/me`
- Get current authenticated user
- Requires: Valid JWT cookie
- Returns: User object

**POST** `/api/auth/logout`
- Clear authentication cookie
- Returns: Success message

### Admin Access

Admin access (`/dashboard/admin`) is granted via a seed script, not through the UI:

1. Set `ADMIN_EMAILS` in the backend's environment to a comma-separated list of email
   addresses. Each one must already have a CreatorLyff account.
2. From `backend/`, run `npm run seed:admin`.
3. Log out and back in so the session picks up `isAdmin`, then visit `/dashboard/admin`.

See `/dashboard/admin/setup` in the app for the same steps with copyable commands.

## Project Structure

```
creator-marketplace/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main landing page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── CreatorCard.tsx
│   ├── CreatorSection.tsx
│   ├── AuthModal.tsx
│   └── ui/
│       └── Button.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   └── utils.ts          # Helper functions
└── backend/               # Express backend
    └── src/
        ├── server.ts      # Express app
        ├── config/        # Database config
        ├── models/        # Mongoose models
        ├── routes/        # API routes
        ├── middleware/    # Auth & rate limiting
        └── utils/         # JWT & validation
```

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with 7-day expiry
- ✅ httpOnly cookies for token storage
- ✅ Rate limiting (5 requests/minute on auth)
- ✅ Email format validation
- ✅ Password strength validation (min 8 chars, 1 number)
- ✅ CORS configuration
- ✅ Proper error handling and status codes

## Development

**Build for production:**
```bash
# Frontend
npm run build

# Backend
cd backend && npm run build
```

**Type checking:**
```bash
# Frontend
npm run type-check

# Backend
cd backend && npm run type-check
```

## License

MIT
