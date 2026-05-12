# Backend Deployment Guide

## Quick Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy Backend
```bash
cd backend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `creator-marketplace-backend` (or your choice)
- Directory? `./` (current directory)
- Override settings? **N**

### 4. Add Environment Variables

After deployment, add these environment variables in Vercel dashboard:

1. Go to https://vercel.com/dashboard
2. Select your backend project
3. Go to Settings → Environment Variables
4. Add these variables:

```env
DATABASE_URL=mongodb+srv://parrvluthra_db_user:Pactor1234@cluster0.3679a6f.mongodb.net/creator-marketplace?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET=8dbd04748e80b5b897f0980ac831aa9d012d2ef55fb0294e31ca4e4799706e76c1c0a0db358539da6e78002df8a8680f3b1267cad771922d73337d302d422c21

NODE_ENV=production

PORT=8080

CORS_ORIGIN=https://creatormarketplace.vercel.app

COOKIE_DOMAIN=vercel.app
```

### 5. Redeploy
```bash
vercel --prod
```

### 6. Update Frontend Environment Variable

Once backend is deployed, you'll get a URL like:
`https://creator-marketplace-backend.vercel.app`

Update your frontend's Vercel environment variables:
1. Go to frontend project in Vercel
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` to your backend URL
4. Redeploy frontend

---

## Alternative: Quick Fix for Testing

If you just want to test locally with your deployed frontend:

### Update Backend CORS (Already Done)
Your backend `.env` now includes:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://creatormarketplace.vercel.app
```

### Restart Backend
```bash
cd backend
npm run dev
```

### Note
This won't work from Vercel frontend to localhost backend due to network restrictions. You need to deploy the backend for production use.

---

## Recommended: Deploy Backend Now

Run these commands:
```bash
cd backend
vercel
```

Then update frontend environment variables and redeploy.
