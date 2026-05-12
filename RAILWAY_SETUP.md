# Railway Backend - Environment Variables Setup

## CRITICAL: Add These Environment Variables to Railway

Go to your Railway project dashboard and add these variables:

### 1. Database Connection
```
DATABASE_URL=mongodb+srv://parrvluthra_db_user:Pactor1234@cluster0.3679a6f.mongodb.net/creator-marketplace?retryWrites=true&w=majority&appName=Cluster0
```

### 2. JWT Secret
```
JWT_SECRET=8dbd04748e80b5b897f0980ac831aa9d012d2ef55fb0294e31ca4e4799706e76c1c0a0db358539da6e78002df8a8680f3b1267cad771922d73337d302d422c21
```

### 3. Environment
```
NODE_ENV=production
```

### 4. Port (Railway auto-assigns, but set as fallback)
```
PORT=8080
```

### 5. CORS Origin (CRITICAL - This fixes the CORS error)
```
CORS_ORIGIN=https://creatormarketplace.vercel.app
```

### 6. Cookie Domain
```
COOKIE_DOMAIN=railway.app
```

---

## How to Add Variables in Railway

1. Go to https://railway.app/dashboard
2. Select your `creatormarketplace-production` project
3. Click on your backend service
4. Go to **Variables** tab
5. Click **+ New Variable**
6. Add each variable above
7. Click **Deploy** to restart with new variables

---

## After Adding Variables

Your backend will restart and:
- ✅ Connect to MongoDB Atlas
- ✅ Allow requests from Vercel frontend
- ✅ No more CORS errors

---

## Vercel Frontend - Update API URL

In Vercel dashboard for your frontend:

1. Go to Settings → Environment Variables
2. Update or add:
   ```
   NEXT_PUBLIC_API_URL=https://creatormarketplace-production.up.railway.app
   ```
   **IMPORTANT:** No trailing slash!

3. Redeploy frontend

---

## Quick Commands

If you need to redeploy after adding variables:

```bash
# Railway will auto-deploy when you add variables
# Or manually trigger:
railway up
```

For frontend:
```bash
cd frontend
vercel --prod
```
