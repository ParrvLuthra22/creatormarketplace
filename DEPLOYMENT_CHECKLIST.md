# Production Deployment Checklist

## MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user (`creatormarketplace`)
- [ ] Save database password securely
- [ ] Configure network access (0.0.0.0/0 for now)
- [ ] Get connection string
- [ ] Replace `<password>` in connection string
- [ ] Add `/creator-marketplace` database name
- [ ] Test connection locally

## Environment Variables
- [ ] Generate strong JWT_SECRET (use provided command)
- [ ] Update `.env` with MongoDB Atlas URL
- [ ] Test local backend with Atlas connection
- [ ] Create `.env.production` for deployment
- [ ] Configure deployment platform env vars

## Deployment Platform Setup
Choose one:

### Option A: Vercel (Recommended for Next.js)
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Login: `vercel login`
- [ ] Deploy frontend: `cd frontend && vercel`
- [ ] Deploy backend: `cd backend && vercel`
- [ ] Add environment variables in Vercel dashboard
- [ ] Update CORS_ORIGIN to Vercel URL

### Option B: Railway
- [ ] Create Railway account
- [ ] Install Railway CLI: `npm i -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Create new project
- [ ] Deploy backend: `railway up`
- [ ] Add environment variables
- [ ] Get deployment URL

### Option C: Render
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create Web Service for backend
- [ ] Add environment variables
- [ ] Deploy

## Testing
- [ ] Backend health check: `GET /api/health`
- [ ] Signup endpoint: `POST /api/auth/signup`
- [ ] Login endpoint: `POST /api/auth/login`
- [ ] Public creators: `GET /api/creators/public`
- [ ] Frontend can connect to backend
- [ ] Authentication flow works
- [ ] Database queries successful

## Security
- [ ] `.env` files in `.gitignore`
- [ ] Strong JWT_SECRET generated
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Vercel/Railway/Render)
- [ ] Cookie domain set correctly
- [ ] MongoDB network access configured

## Monitoring
- [ ] Check MongoDB Atlas metrics
- [ ] Monitor connection count
- [ ] Check error logs
- [ ] Set up alerts (optional)

## Next Steps After Deployment
1. Update frontend API URL to production backend
2. Test all features in production
3. Set up custom domain (optional)
4. Configure Razorpay for production (when ready)
5. Monitor performance and errors
