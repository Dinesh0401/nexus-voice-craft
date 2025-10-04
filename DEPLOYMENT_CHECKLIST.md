# Deployment Checklist

## Pre-Deployment Setup

### 1. Backend Configuration

- [ ] Get OpenRouter API key from https://openrouter.ai (FREE)
- [ ] Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Update `server/.env` with:
  ```env
  OPENROUTER_API_KEY=your_key_here
  JWT_SECRET=your_generated_secret
  ```
- [ ] Verify Supabase credentials are correct
- [ ] Test backend locally: `cd server && npm run dev`

### 2. Frontend Configuration

- [ ] Verify `.env` contains:
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api/v1
  VITE_SOCKET_URL=http://localhost:5000
  ```
- [ ] Test frontend locally: `npm run dev`
- [ ] Build production bundle: `npm run build`
- [ ] Verify build succeeded

### 3. Local Testing

- [ ] Start both servers (use `./start.sh` or manual)
- [ ] Access main app: http://localhost:8080
- [ ] Test AI features: http://localhost:8080/ai-demo
- [ ] Try AI chat - verify responses
- [ ] Check real-time features
- [ ] Test API health: http://localhost:5000/health
- [ ] Verify WebSocket connection

## Production Deployment

### Frontend (Vercel/Netlify)

#### Vercel Deployment
1. [ ] Install Vercel CLI: `npm i -g vercel`
2. [ ] Run `vercel` in project root
3. [ ] Follow prompts
4. [ ] Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL` (production backend URL)
   - `VITE_SOCKET_URL` (production backend URL)
5. [ ] Deploy: `vercel --prod`

#### Netlify Deployment
1. [ ] Build: `npm run build`
2. [ ] Install Netlify CLI: `npm i -g netlify-cli`
3. [ ] Run `netlify deploy`
4. [ ] Deploy dist folder
5. [ ] Set environment variables in Netlify dashboard
6. [ ] Deploy to production: `netlify deploy --prod`

### Backend (Railway/Render/Heroku)

#### Railway Deployment
1. [ ] Create account at https://railway.app
2. [ ] Create new project
3. [ ] Connect GitHub repository
4. [ ] Set root directory to `/server`
5. [ ] Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   OPENROUTER_API_KEY=your_key
   JWT_SECRET=your_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ALLOWED_ORIGINS=your_frontend_url
   ```
6. [ ] Deploy
7. [ ] Note the production URL

#### Render Deployment
1. [ ] Create account at https://render.com
2. [ ] Create new Web Service
3. [ ] Connect GitHub repository
4. [ ] Set:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. [ ] Add environment variables (same as Railway)
6. [ ] Deploy

#### Heroku Deployment
1. [ ] Create account at https://heroku.com
2. [ ] Install Heroku CLI
3. [ ] Create app: `heroku create your-app-name`
4. [ ] Add Procfile in server directory:
   ```
   web: node src/server.js
   ```
5. [ ] Set environment variables:
   ```bash
   heroku config:set OPENROUTER_API_KEY=your_key
   heroku config:set JWT_SECRET=your_secret
   # ... etc
   ```
6. [ ] Deploy: `git push heroku main`

### Database (Supabase)

- [ ] Verify Supabase project is active
- [ ] Check database tables are created
- [ ] Verify RLS policies are set
- [ ] Test database connection
- [ ] Enable database backups

### Redis Cache (Optional - Upstash)

1. [ ] Create account at https://upstash.com
2. [ ] Create Redis database
3. [ ] Copy Redis URL
4. [ ] Add to backend environment:
   ```
   REDIS_URL=your_upstash_redis_url
   ```

## Post-Deployment Verification

### Frontend Checks
- [ ] Visit production URL
- [ ] Check all pages load
- [ ] Verify navigation works
- [ ] Test responsive design (mobile, tablet)
- [ ] Check AI demo page
- [ ] Verify images load
- [ ] Test forms and inputs

### Backend Checks
- [ ] Test health endpoint: `https://your-backend/health`
- [ ] Check metrics: `https://your-backend/metrics`
- [ ] Verify API responses
- [ ] Test authentication
- [ ] Check WebSocket connection
- [ ] Monitor error logs

### AI Integration Checks
- [ ] Test AI chat feature
- [ ] Verify streaming responses
- [ ] Check recommendations
- [ ] Test career advice
- [ ] Verify profile analysis
- [ ] Monitor AI API usage on OpenRouter dashboard

### Security Checks
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] JWT tokens working
- [ ] Environment variables secured
- [ ] No sensitive data in logs

### Performance Checks
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify API response times
- [ ] Monitor WebSocket latency
- [ ] Check memory usage
- [ ] Test under load

## Monitoring & Maintenance

### Set Up Monitoring
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring (Uptime Robot, etc.)
- [ ] Enable log aggregation
- [ ] Set up alerts for errors
- [ ] Monitor API usage on OpenRouter

### Regular Maintenance
- [ ] Monitor OpenRouter API usage
- [ ] Check error logs weekly
- [ ] Review security updates
- [ ] Update dependencies monthly
- [ ] Backup database regularly
- [ ] Monitor costs and usage

## Troubleshooting

### Common Issues

**CORS Errors:**
- Check ALLOWED_ORIGINS in backend .env
- Verify frontend URL is whitelisted

**AI Not Responding:**
- Verify OpenRouter API key
- Check API usage limits
- Review backend logs

**WebSocket Connection Failed:**
- Verify Socket.IO server is running
- Check VITE_SOCKET_URL
- Ensure WebSocket port is open

**Authentication Errors:**
- Verify JWT_SECRET is set
- Check token expiration
- Review auth middleware

**Database Connection:**
- Verify Supabase credentials
- Check database status
- Review connection limits

## Rollback Plan

If deployment fails:

1. [ ] Keep previous version accessible
2. [ ] Document the issue
3. [ ] Rollback frontend (Vercel/Netlify dashboard)
4. [ ] Rollback backend (Railway/Render dashboard)
5. [ ] Investigate logs
6. [ ] Fix issues in development
7. [ ] Re-deploy when ready

## Success Criteria

Deployment is successful when:

- ✅ Frontend loads without errors
- ✅ Backend health check returns OK
- ✅ AI features respond correctly
- ✅ Real-time chat works
- ✅ Authentication functions
- ✅ All API endpoints respond
- ✅ WebSocket connection stable
- ✅ No console errors
- ✅ Mobile responsive works
- ✅ Performance acceptable

## Going Live

- [ ] Final testing complete
- [ ] All checks passed
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Team notified
- [ ] Users can access
- [ ] Support ready

## Post-Launch

- [ ] Monitor first 24 hours closely
- [ ] Collect user feedback
- [ ] Address any issues immediately
- [ ] Document lessons learned
- [ ] Plan next iteration

---

**Note**: Keep this checklist handy during deployment. Check off items as you complete them to ensure nothing is missed.

## Quick Reference URLs

- **OpenRouter**: https://openrouter.ai
- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com
- **Supabase**: https://supabase.com
- **Upstash**: https://upstash.com

Good luck with your deployment! 🚀
