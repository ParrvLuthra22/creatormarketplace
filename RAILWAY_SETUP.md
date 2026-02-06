# Railway Backend - Environment Variables Setup

## CRITICAL: Add These Environment Variables to Railway

Go to your Railway project dashboard and add these variables:

### 1. Database Connection
```
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/creator-marketplace?retryWrites=true&w=majority&appName=Cluster0
```

### 2. JWT Secret
```
JWT_SECRET=<generate with: openssl rand -hex 64>
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
